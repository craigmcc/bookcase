// DevModeRouter -------------------------------------------------------------

// Development mode operations to manage seed data in the database.

// External Modules ----------------------------------------------------------

import { Request, Response, Router } from "express";

// Internal Modules ----------------------------------------------------------

import { reload, resync } from "../services/DevModeServices";

// Public Objects ------------------------------------------------------------

export const DevModeRouter = Router({
    strict: true
});

// POST /reload - Reload seed data (does a resync() first)
DevModeRouter.post("/reload",
    async (req: Request, res: Response) => {
    res.send(await reload(req.query));
});

// POST /resync - Delete and recreate all database tables
DevModeRouter.post("/resync",
    async (req: Request, res: Response) => {
    res.send(await resync(req.query));
});

export default DevModeRouter;
