// OAuthAccessTokenRouter -----------------------------------------------------------

// Express operations on OAuthAccessToken model objects.

// Exterrnal Modules ---------------------------------------------------------

import { Request, Response, Router } from "express";

// Internal Modules ----------------------------------------------------------

import OAuthAccessTokenServices from "./OAuthAccessTokenServices";
import { requireSuperuser } from "./OAuthMiddleware";

// Public Objects ------------------------------------------------------------

export const OAuthAccessTokenRouter = Router({
    strict: true,
});

// Router-wide Middleware ----------------------------------------------------

OAuthAccessTokenRouter.use(requireSuperuser);

// Model-Specific Routes (no tokenId) ----------------------------------------

// GET /exact/:token - Find OAuthAccessToken by exact token
OAuthAccessTokenRouter.get("/exact/:token",
    async (req: Request, res: Response) => {
        res.send(await OAuthAccessTokenServices.exact(
            req.params.token,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all AccessTokens
OAuthAccessTokenRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await OAuthAccessTokenServices.all(
            req.query
        ));
    });

// POST / - Insert a new OAuthAccessToken
OAuthAccessTokenRouter.post("/",
    async (req: Request, res: Response) => {
        res.send(await OAuthAccessTokenServices.insert(
            req.body
        ));
    });

// DELETE /:accessTokenId - Remove OAuthAccessToken by ID
OAuthAccessTokenRouter.delete("/:accessTokenId",
    async (req: Request, res: Response) => {
        res.send(await OAuthAccessTokenServices.remove(
            parseInt(req.params.accessTokenId, 10)
        ));
    });

// GET /:accessTokenId - Find OAuthAccessToken by ID
OAuthAccessTokenRouter.get("/:accessTokenId",
    async (req: Request, res: Response) => {
        console.info("Begin OAuthAccessTokenServices.find(" + req.params.accessTokenId + ")");
        res.send(await OAuthAccessTokenServices.find(
            parseInt(req.params.accessTokenId, 10),
            req.query
        ));
        console.info("End OAuthAccessTokenServices.find()");
    });

// PUT /:accessTokenId - Update OAuthAccessToken by ID
OAuthAccessTokenRouter.put("/:accessTokenId",
    async (req: Request, res: Response) => {
        res.send(await OAuthAccessTokenServices.update(
            parseInt(req.params.accessTokenId, 10),
            req.body
        ));
    });

export default OAuthAccessTokenRouter;
