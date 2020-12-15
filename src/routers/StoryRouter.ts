// StoryRouter ---------------------------------------------------------------

// Express operations on Story model objects.

// External Modules ----------------------------------------------------------

import { Request, Response, Router } from "express";

// Internal Modules ----------------------------------------------------------

import { requireSuperuser } from "../oauth/OAuthMiddleware";
import StoryServices from "../services/StoryServices";

// Public Objects ------------------------------------------------------------

export const StoryRouter = Router({
    strict: true
});

// Author-wide Middleware ----------------------------------------------------

StoryRouter.use(requireSuperuser);

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all Stories
StoryRouter.get("/",
    async (req: Request, res: Response) => {
    res.send(await StoryServices.all(
        req.query
    ));
});

// POST / - Insert a new Story
StoryRouter.post("/",
    async (req: Request, res: Response) => {
    res.send(await StoryServices.insert(
        req.body
    ));
});

// DELETE /:storyId - Remove Story by ID
StoryRouter.delete("/:storyId",
    async (req: Request, res: Response) => {
    res.send(await StoryServices.remove(
        parseInt(req.params.storyId, 10)
    ));
});

// GET /:storyId - Find Story by ID
StoryRouter.get("/:storyId",
    async (req: Request, res: Response) => {
    res.send(await StoryServices.find(
        parseInt(req.params.storyId, 10),
        req.query
    ));
});

// PUT /:storyId - Update Story by ID
StoryRouter.put("/:storyId",
    async (req: Request, res: Response) => {
    res.send(await StoryServices.update(
        parseInt(req.params.storyId, 10),
        req.body
    ));
});

// Story-Author Routes -------------------------------------------------------

// GET /:storyId/authors - Retrieve all Authors for the specified Story
StoryRouter.get(
    "/:storyId/authors",
    async (req: Request, res: Response) => {
    res.send(await StoryServices.authorsAll(
        parseInt(req.params.storyId),
        req.query
    ));
});

// DELETE /:storyId/authors/:authorId - Remove specified Author from specified Story
StoryRouter.delete(
    "/:storyId:/authors/:authorId",
    async (req: Request, res: Response) => {
    res.send(await StoryServices.authorsRemove(
        parseInt(req.params.storyId, 10),
        parseInt(req.params.authorId, 10)
    ));
});

// GET /:storyId/authors/:name - Retrieve all Authors with name match
StoryRouter.get(
    "/:storyId/authors/name/:name",
    async (req: Request, res: Response) => {
    res.send(await StoryServices.authorsName(
        parseInt(req.params.storyId),
        req.params.name,
        req.query
    ));
});

// POST /:storyId/authors/:authorId - Add specified Author to specified Story
StoryRouter.post(
    "/:storyId:/authors/:authorId",
    async (req: Request, res: Response) => {
    res.send(await StoryServices.authorsAdd(
        parseInt(req.params.storyId, 10),
        parseInt(req.params.authorId, 10)
    ));
});

export default StoryRouter;
