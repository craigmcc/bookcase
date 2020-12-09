// http-errors ---------------------------------------------------------------

// Public error classes for HTTP responses that optionally include the
// service name and the status code to be returned.

// Public Classes ------------------------------------------------------------

/**
 * Base class that defines the standard properties of an HTTP error that will be
 * formatted and returned in the body of the response.  In addition, the "status"
 * property will be used to set the HTTP status header value.
 */
export class HttpError extends Error {

    constructor(message: string, service : string | undefined, status: number = 500) {
        super(message);
        this.service = service;
        this.status = status;
    }

    service: string | undefined;
    status: number = 500;

}

/**
 * Report a problem processing the input to a service.
 */
export class BadRequest extends HttpError {
    constructor(message: string, service: string | undefined) {
        super(message, service, 400);
    }
}

/**
 * Report that a requested operation is not allowed for the requestor.
 */
export class Forbidden extends HttpError {
    constructor(message: string, service: string | undefined) {
        super(message, service, 403);
    }
}

/**
 * Report that requested information was not found by the provided identifiers.
 */
export class NotFound extends HttpError {
    constructor(message: string, service: string | undefined) {
        super(message, service, 404);
    }
}

/**
 * Report that a requested insert or update would violate uniqueness constraints.
 */
export class NotUnique extends HttpError {
    constructor(message: string, service: string | undefined) {
        super(message, service, 409);
    }
}

/**
 * Report that an internal server error of some sort has occurred.
 */
export class ServerError extends HttpError {
    constructor(message: string, service: string | undefined) {
        super(message, service, 500);
    }
}
