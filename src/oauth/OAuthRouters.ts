// OAuthRouters --------------------------------------------------------------

// Consolidation of Routers for REST APIs for OAuth 2 model objects.

// External Modules ----------------------------------------------------------

import { Router } from "express";

// Internal Modules ----------------------------------------------------------

import OAuthUserRouter from "./OAuthUserRouter";

// Public Classes ------------------------------------------------------------

export const OAuthRouters = Router({
    strict: true,
})

// Model-Specific Routers ----------------------------------------------------

OAuthRouters.use("/users", OAuthUserRouter);

export default OAuthRouters;
