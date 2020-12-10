// OAuthRefreshTokenRouter ---------------------------------------------------

// Express operations on OAuthRefreshToken model objects.

// Exterrnal Modules ---------------------------------------------------------

import { Request, Response, Router } from "express";

// Internal Modules ----------------------------------------------------------

import OAuthRefreshTokenServices from "./OAuthRefreshTokenServices";

// Public Objects ------------------------------------------------------------

export const OAuthRefreshTokenRouter = Router({
    strict: true,
});

// Model-Specific Routes (no tokenId) -----------------------------------------

// GET /exact/:token - Find OAuthRefreshToken by exact token
OAuthRefreshTokenRouter.get("/exact/:token",
    async (req: Request, res: Response) => {
        res.send(await OAuthRefreshTokenServices.exact(
            req.params.token,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all RefreshTokens
OAuthRefreshTokenRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await OAuthRefreshTokenServices.all(
            req.query
        ));
    });

// POST / - Insert a new OAuthRefreshToken
OAuthRefreshTokenRouter.post("/",
    async (req: Request, res: Response) => {
        res.send(await OAuthRefreshTokenServices.insert(
            req.body
        ));
    });

// DELETE /:refreshTokenId - Remove OAuthRefreshToken by ID
OAuthRefreshTokenRouter.delete("/:refreshTokenId",
    async (req: Request, res: Response) => {
        res.send(await OAuthRefreshTokenServices.remove(
            parseInt(req.params.refreshTokenId, 10)
        ));
    });

// GET /:refreshTokenId - Find OAuthRefreshToken by ID
OAuthRefreshTokenRouter.get("/:refreshTokenId",
    async (req: Request, res: Response) => {
        console.info("Begin OAuthRefreshTokenServices.find(" + req.params.refreshTokenId + ")");
        res.send(await OAuthRefreshTokenServices.find(
            parseInt(req.params.refreshTokenId, 10),
            req.query
        ));
        console.info("End OAuthRefreshTokenServices.find()");
    });

// PUT /:refreshTokenId - Update OAuthRefreshToken by ID
OAuthRefreshTokenRouter.put("/:refreshTokenId",
    async (req: Request, res: Response) => {
        res.send(await OAuthRefreshTokenServices.update(
            parseInt(req.params.refreshTokenId, 10),
            req.body
        ));
    });

export default OAuthRefreshTokenRouter;
