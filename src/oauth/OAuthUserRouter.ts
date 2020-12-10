// OAuthUserRouter -----------------------------------------------------------

// Express operations on OAuthUser model objects.

// Exterrnal Modules ---------------------------------------------------------

import { Request, Response, Router } from "express";

// Internal Modules ----------------------------------------------------------

import OAuthUserServices from "./OAuthUserServices";

// Public Objects ------------------------------------------------------------

export const OAuthUserRouter = Router({
    strict: true,
});

// Model-Specific Routes (no userId) -----------------------------------------

// GET /active - Find active Users
OAuthUserRouter.get("/active",
    async (req: Request, res: Response) => {
        res.send(await OAuthUserServices.active(
            req.query
        ));
    });

// GET /exact/:name - Find OAuthUser by exact username
OAuthUserRouter.get("/exact/:username",
    async (req: Request, res: Response) => {
        res.send(await OAuthUserServices.exact(
            req.params.username,
            req.query
        ));
    });

// GET /name/:name - Find Users by name match
OAuthUserRouter.get("/name/:name",
    async (req: Request, res: Response) => {
        res.send(await OAuthUserServices.name(
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all Users
OAuthUserRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await OAuthUserServices.all(
            req.query
        ));
    });

// POST / - Insert a new OAuthUser
OAuthUserRouter.post("/",
    async (req: Request, res: Response) => {
        res.send(await OAuthUserServices.insert(
            req.body
        ));
    });

// DELETE /:userId - Remove OAuthUser by ID
OAuthUserRouter.delete("/:userId",
    async (req: Request, res: Response) => {
        res.send(await OAuthUserServices.remove(
            parseInt(req.params.userId, 10)
        ));
    });

// GET /:userId - Find OAuthUser by ID
OAuthUserRouter.get("/:userId",
    async (req: Request, res: Response) => {
        console.info("Begin OAuthUserServices.find(" + req.params.userId + ")");
        res.send(await OAuthUserServices.find(
            parseInt(req.params.userId, 10),
            req.query
        ));
        console.info("End OAuthUserServices.find()");
    });

// PUT /:userId - Update OAuthUser by ID
OAuthUserRouter.put("/:userId",
    async (req: Request, res: Response) => {
        res.send(await OAuthUserServices.update(
            parseInt(req.params.userId, 10),
            req.body
        ));
    });

// OAuthUser->OAuthAccessToken Routes ----------------------------------------

// GET /:userId/accessTokens/all - Find all related access tokens
OAuthUserRouter.get("/:userId/accessTokens/all",
    async (req: Request, res: Response) => {
      res.send(await OAuthUserServices.accessTokensAll(
            parseInt(req.params.userId, 10),
            req.query
        ));
    });

// OAuthUser->OAuthRefreshToken Routes ---------------------------------------

// GET /:userId/refreshTokens/all - Find all related refresh tokens
OAuthUserRouter.get("/:userId/refreshTokens/all",
    async (req: Request, res: Response) => {
        res.send(await OAuthUserServices.refreshTokensAll(
            parseInt(req.params.userId, 10),
            req.query
        ));
    });

export default OAuthUserRouter;
