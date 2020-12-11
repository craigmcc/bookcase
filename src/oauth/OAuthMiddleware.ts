// OAuthMiddleware -----------------------------------------------------------

// Express middleware to enforce OAuth scope limits.

// External Modules ----------------------------------------------------------

import { OAuthError, OAuthServer } from "@craigmcc/basic-oauth2-server";
import {ErrorRequestHandler, NextFunction, Request, RequestHandler, Response} from "express";

// Internal Modules ----------------------------------------------------------

import {Forbidden, HttpError} from "../util/http-errors";
import { OAuthServerImpl as oauthServer } from "../server";

// Public Functions ----------------------------------------------------------

/**
 * Handle OAuthError errors by formatting and sending the
 * appropriate HTTP response.
 */
export const handleOAuthError: ErrorRequestHandler =
    (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof OAuthError) {
            res.status(error.status).send({
                context: error.context ? error.context : undefined,
                message: error.message,
                name: error.name ? error.name : undefined,
                status: error.status ? error.status : undefined,
            });
        } else {
            next(error);
        }
}

/**
 * Require "admin" scope (for a specific library) to handle this request.
 */
export const requireAdmin: RequestHandler =
    (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req);
        if (!token) {
            throw new Forbidden("No access token presented", "requireToken");
        }
        const required = mapLibraryId(req) + " admin";
        authorizeToken(token, required);
        next();
}

/**
 * Require "regular" scope (for a specific library) to handle this request.
 */
export const requireRegular: RequestHandler =
    (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req);
        if (!token) {
            throw new Forbidden("No access token presented", "requireToken");
        }
        const required = mapLibraryId(req) + " admin";
        authorizeToken(token, required);
    }

/**
 * Require "superuser" scope to handle this request.
 */
export const requireSuperuser: RequestHandler =
    (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req);
        if (!token) {
            throw new Forbidden("No access token presented", "requireToken");
        }
        authorizeToken(token, "superuser");
}

// Private Functions ---------------------------------------------------------

/**
 * Request the OAuthServer infrastructure to authorize the specified token
 * for the specified required scope.  Returns normally if successsful.
 *
 * @param token         The access token to be authorized
 * @param required      Required scope for the access token to be used
 *
 * @throws              Error returned by OAuthServer.authorize()
 *                      if token was not successfully authorized
 */
const authorizeToken = (token: string, required: string): void => {
    try {
        oauthServer.authorize(token, required);
    } catch (error) {
        console.error(`authorizeToken: token '${token}' does not satisfy scope '${required}'`);
        console.error("authorizeToken: error: ", error);
        throw error;
    }

}

/**
 * Extract and return the presented access token in this request (if any).
 *
 * IMPLEMENTATION NOTE:  We *only* support the "Authorization" header
 * mechanism to receive a bearer token that RFC 6750 defines (Section 2.1).
 *
 * @param               The HTTP request being processed
 *
 * @returns             Extracted access token (if any) or null
 */
const extractToken = (req: Request) : string | null => {
    const header: string | undefined = req.header("Authorization");
    if (!header) {
        console.error("authorizeToken: No Authorization header included");
        return null;
    }
    const fields: string[] = header.split(" ");
    if (fields.length != 2) {
        console.error(`authorizeToken: header '${header}' is malformed`);
        return null;
    }
    if (fields[0] !== "Bearer") {
        console.error(`authorizeToken: header '${header}' is not type Bearer`);
        return null;
    }
    return fields[1];
}

const mapping = new Map<number, string>();
mapping.set(1, "first");
mapping.set(2, "second");

/**
 * Map the libraryId parameter on this request to a corresponding scope value
 * that must be authorized for the request's access token.
 *
 * TODO - need to dynamically load the libraryId->scope information
 * TODO - and keep it up to date
 *
 * @param req           The HTTP request being processed
 *
 * @returns scope value to be included in the authorize request.
 */
const mapLibraryId = (req: Request): string => {
    const libraryId: string | null = req.params.libraryId;
    if (!libraryId) {
        return "notincluded";
    }
    const scope: string | undefined = mapping.get(parseInt(libraryId));
    if (!scope) {
        return "notknown";
    }
    return scope;
}

