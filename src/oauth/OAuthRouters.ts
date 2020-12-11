// OAuthRouters --------------------------------------------------------------

// Consolidation of Routers for REST APIs for OAuth 2 model objects.

// External Modules ----------------------------------------------------------

import { Router } from "express";

// Internal Modules ----------------------------------------------------------

import OAuthUserRouter from "./OAuthUserRouter";
import OAuthAccessTokenRouter from "./OAuthAccessTokenRouter";
import OAuthRefreshTokenRouter from "./OAuthRefreshTokenRouter";
import OAuthTokenRouter from "./OAuthTokenRouter";

// Public Classes ------------------------------------------------------------

export const OAuthRouters = Router({
    strict: true,
})

// Model-Specific Routers ----------------------------------------------------

OAuthRouters.use("/accessTokens", OAuthAccessTokenRouter);
OAuthRouters.use("/refreshTokens", OAuthRefreshTokenRouter);
OAuthRouters.use("/token", OAuthTokenRouter);
OAuthRouters.use("/users", OAuthUserRouter);

export default OAuthRouters;
