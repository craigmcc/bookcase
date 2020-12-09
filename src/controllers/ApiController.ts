// ApiController -------------------------------------------------------------

// Express controller for all "/api" endpoints.

// External Modules ----------------------------------------------------------

import {
    ChildControllers,
    ClassErrorMiddleware,
    ClassOptions,
    Controller
} from "@overnightjs/core";

// Internal Modules ----------------------------------------------------------

import LibraryController from "./LibraryController";
import {
    handleHttpError,
    handleServerError,
    handleValidationError
} from "../util/middleware";

// Public Objects ------------------------------------------------------------

@Controller("api")
@ClassOptions({
    mergeParams: true
})
@ClassErrorMiddleware([
    handleHttpError,
    handleValidationError,
    handleServerError,      // Must be last because it sends a response unconditionally
])
@ChildControllers([
    new LibraryController(),
])
export class ApiController {

    // Provides class-level configuration for all child controllers

}

export default ApiController;
