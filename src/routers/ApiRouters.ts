// ApiRouters ----------------------------------------------------------------

// Consolidation of Routers for REST APIs for model objects.

// External Modules ----------------------------------------------------------

import { Router } from "express";

// Internal Modules ----------------------------------------------------------

import AuthorRouter from "./AuthorRouter";
import LibraryRouter from "./LibraryRouter";
import StoryRouter from "./StoryRouter";

// Public Classes ------------------------------------------------------------

export const ApiRouters = Router({
    strict: true,
})

// Model-specific Routers ----------------------------------------------------

ApiRouters.use("/authors", AuthorRouter);
ApiRouters.use("/libraries", LibraryRouter);
ApiRouters.use("/stories", StoryRouter);

export default ApiRouters;
