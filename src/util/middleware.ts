// middleware ----------------------------------------------------------------

// Create and return Express middleware functions that can be used to configure
// Router implementations (or the entire application) via use() calls.

// External Modules -----------------------------------------------------------

import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
//import { SequelizeValidationError } from "sequelize";
const SequelizeValidationError = require("sequelize");

// Internal Modules ----------------------------------------------------------

import { HttpError } from "./http-errors";

// Public Functions -----------------------------------------------------------

/**
 * Handle HttpError errors by formatting and sending the
 * appropriate HTTP response.
 */
export const handleHttpError: ErrorRequestHandler =
        (error: HttpError, req: Request, res: Response, next: NextFunction) => {
/*
    console.error("handleHttpError: "
        + JSON.stringify(error, null, 2));
    console.error("stack Trace: ", error.stack);
*/
            if (error instanceof HttpError) {
                res.status(error.status).send({
                    message: error.message,
                    service: error.service ? error.service : "Service",
                    status: error.status,
                });
            } else {
                next(error);
            }
}

/**
 * Handle ValidationError errors by formatting and sending the
 * appropriate HTTP response.
 */
export const handleValidationError: ErrorRequestHandler =
    (error: typeof SequelizeValidationError, req: Request, res: Response, next: NextFunction) => {
/*
        console.error("handleValidationError: "
            + JSON.stringify(error, null, 2));
        console.error("Stack Trace: " + error.stack);
*/
        if (error.name && (error.name === "SequelizeValidationError")) {
            res.status(400).send({
                message: error.message,
                status: 400,
            });
        } else {
            next(error);
        }
}
