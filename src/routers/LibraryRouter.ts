// LibraryRouter -------------------------------------------------------------

// Express operations on Library model objects.

// External Modules ----------------------------------------------------------

import { Request, Response, Router } from "express";

// Internal Modules ----------------------------------------------------------

import {
    dumpRequestDetails,
    requireAdmin,
    requireRegular,
    requireSuperuser
} from "../oauth/OAuthMiddleware";
import LibraryServices from "../services/LibraryServices";

// Public Objects ------------------------------------------------------------

export const LibraryRouter = Router({
    strict: true,
});

//LibraryRouter.use(dumpRequestDetails);

// Model-Specific Routes (no libraryId) --------------------------------------

// GET /active - Find active Libraries
LibraryRouter.get("/active",
    requireSuperuser,       // TODO - might need to relax?
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.active(
            req.query
        ));
    });

// GET /exact/:name - Find Library by exact name
LibraryRouter.get("/exact/:name",
    requireSuperuser,       // TODO - might need to relax?
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.exact(
            req.params.name,
            req.query
        ));
    });

// GET /name/:name - Find Libraries by name match
LibraryRouter.get("/name/:name",
    requireSuperuser,       // TODO - might need to relax?
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.name(
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all Libraries
LibraryRouter.get("/",
    requireSuperuser,       // TODO - might need to relax?
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.all(
            req.query
        ));
    });

// POST / - Insert a new Library
LibraryRouter.post("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.insert(
            req.body
        ));
    });

// DELETE /:libraryId - Remove Library by ID
LibraryRouter.delete("/:libraryId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.remove(
            parseInt(req.params.libraryId, 10)
        ));
    });

// GET /:libraryId - Find Library by ID
LibraryRouter.get("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        console.info("Begin LibraryServices.find(" + req.params.libraryId + ")");
        res.send(await LibraryServices.find(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
        console.info("End LibraryServices.find()");
    });

// PUT /:libraryId - Update Library by ID
LibraryRouter.put("/:libraryId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.update(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// Library->Author Routes ----------------------------------------------------

// GET /:libraryId/authors/active - Find active related Authors
LibraryRouter.get("/:libraryId/authors/active",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.authorsActive(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/authors/all - Find all related Authors
LibraryRouter.get("/:libraryId/authors/all",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.authorsAll(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/authors/exact/:firstName/:lastName - Find related Author by exact name
LibraryRouter.get("/:libraryId/authors/exact/:firstName/:lastName",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.authorsExact(
            parseInt(req.params.libraryId, 10),
            req.params.firstName,
            req.params.lastName,
            req.query
        ));
    });

// GET /:libraryId/authors/name/:name - Find related Authors by name match
LibraryRouter.get("/:libraryId/authors/name/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.authorsName(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// Library->Story Routes ----------------------------------------------------

// GET /:libraryId/stories/active - Find active related Stories
LibraryRouter.get("/:libraryId/stories/active",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.storiesActive(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/stories/all - Find all related Stories
LibraryRouter.get("/:libraryId/stories/all",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.storiesAll(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/stories/exact/:name - Find related Story by exact name
LibraryRouter.get("/:libraryId/stories/exact/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.storiesExact(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// GET /:libraryId/stories/name/:name - Find related Stories by name match
LibraryRouter.get("/:libraryId/stories/name/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.storiesName(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    })

export default LibraryRouter;
