// AuthorRouter --------------------------------------------------------------

// Express operations on Author objects.

// External Modules ----------------------------------------------------------

import { Request, Response, Router } from "express";

// Internal Modules ----------------------------------------------------------

import { requireSuperuser } from "../oauth/OAuthMiddleware";
import AuthorServices from "../services/AuthorServices";

// Public Objects ------------------------------------------------------------

export const AuthorRouter = Router({
    strict: true
});

// Author-wide Middleware ----------------------------------------------------

AuthorRouter.use(requireSuperuser);

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all Authors
AuthorRouter.get("/",
    async (req: Request, res: Response) => {
    res.send(await AuthorServices.all(
        req.query
    ));
});

// POST / - Insert a new Author
AuthorRouter.post("/",
    async (req: Request, res: Response) => {
    res.send(await AuthorServices.insert(
        req.body
    ));
});

// DELETE /:authorId - Remove Author by ID
AuthorRouter.delete("/:authorId",
    async (req: Request, res: Response) => {
    res.send(await AuthorServices.remove(
        parseInt(req.params.storyId, 10)
    ));
});

// GET /:authorId - Find Author by ID
AuthorRouter.get("/:authorId",
    async (req: Request, res: Response) => {
    res.send(await AuthorServices.find(
        parseInt(req.params.authorId, 10),
        req.query
    ));
});

// PUT /:authorId - Update Author by ID
AuthorRouter.put("/:authorId",
    async (req: Request, res: Response) => {
    res.send(await AuthorServices.update(
        parseInt(req.params.authorId, 10),
        req.body
    ));
});

// Author-Story Routes -------------------------------------------------------

// GET /:authorId/stories - Retrieve all Stories for the specified Author
AuthorRouter.get(
    "/:authorId/stories",
    async (req: Request, res: Response) => {
    res.send(await AuthorServices.storiesAll(
        parseInt(req.params.authorId),
        req.query
    ));
});

// DELETE /:authorId/stories/:storyId - Remove specified Story from specified Author
AuthorRouter.delete(
    "/:authorId:/stories/:storyId",
    async (req: Request, res: Response) => {
    res.send(await AuthorServices.storiesRemove(
        parseInt(req.params.authorId, 10),
        parseInt(req.params.storyId, 10)
    ));
});

// GET /:authorId/stories/:name - Retrieve all Stories with name match
AuthorRouter.get(
    "/:authorId/stories/name/:name",
    async (req: Request, res: Response) => {
    res.send(await AuthorServices.storiesName(
        parseInt(req.params.authorId),
        req.params.name,
        req.query
    ));
});


// POST /:authorId/stories/:storyId - Add specified Story to specified Author
AuthorRouter.post(
    "/:authorId:/stories/:storyId",
    async (req: Request, res: Response) => {
    res.send(await AuthorServices.storiesAdd(
        parseInt(req.params.authorId, 10),
        parseInt(req.params.storyId, 10)
    ));
})

export default AuthorRouter;
