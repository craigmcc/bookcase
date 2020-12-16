// OAuthMiddleware -----------------------------------------------------------

// Express middleware to enforce OAuth scope limits.

// External Modules ----------------------------------------------------------

import { OAuthError } from "@craigmcc/oauth-orchestrator";
import {
    ErrorRequestHandler,
    NextFunction,
    Request,
    RequestHandler,
    Response
} from "express";

// Internal Modules ----------------------------------------------------------

import { OAuthOrchestrator } from "../server";
import { Forbidden } from "../util/http-errors";

// Public Functions ----------------------------------------------------------

/**
 * Dump request details (for debugging only).
 */
export const dumpRequestDetails: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        console.info(`Handling ${req.method} ${req.url} details:`);
        console.info(`  authorization: ${req.get("authorization")}`);
        console.info(`  baseUrl:       ${req.baseUrl}`);
        console.info(`  originalUrl:   ${req.originalUrl}`);
        console.info(`  params:        ${JSON.stringify(req.params)}`);
        console.info(`  path:          ${req.path}`);
        console.info(`  query:         ${JSON.stringify(req.query)}`);
        console.info(`  token:         ${res.locals.token}`);
        next();
}

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
    async (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req);
        if (!token) {
            throw new Forbidden("No access token presented", "requireToken");
        }
        const required = mapLibraryId(req) + " admin";
        await authorizeToken(token, required);
        res.locals.token = token;
        next();
}

/**
 * Require just a validated token, no matter what scopes might be allowed.
 */
export const requireAny: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req);
        if (!token) {
            throw new Forbidden("No access token presented", "requireToken");
        }
        const required = "";
        await authorizeToken(token, required);
        res.locals.token = token;
        next();
    }

/**
 * Require "regular" scope (for a specific library) to handle this request.
 */
export const requireRegular: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req);
        if (!token) {
            throw new Forbidden("No access token presented", "requireToken");
        }
        const required = mapLibraryId(req) + " regular";
        await authorizeToken(token, required);
        res.locals.token = token;
        next();
    }

/**
 * Require "superuser" scope to handle this request.
 */
export const requireSuperuser: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req);
        if (!token) {
            throw new Forbidden("No access token presented", "requireToken");
        }
        await authorizeToken(token, "superuser");
        res.locals.token = token;
        next();
}

// Private Functions ---------------------------------------------------------

/**
 * Request the OAuthServer infrastructure to authorize the specified token
 * for the specified required scope.  Returns normally if successful.
 *
 * @param token         The access token to be authorized
 * @param required      Required scope for the access token to be used
 *
 * @throws              Error returned by OAuthServer.authorize()
 *                      if token was not successfully authorized
 */
const authorizeToken = async (token: string, required: string): Promise<void> => {
    try {
        await OAuthOrchestrator.authorize(token, required);
    } catch (error) {
        console.error(`authorizeToken: token '${token}' does not satisfy scope '${required}'`);
//        console.error("authorizeToken: error: ", error);
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

