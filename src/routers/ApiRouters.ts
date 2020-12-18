// ApiRouters ----------------------------------------------------------------

// Consolidation of Routers for REST APIs for application model objects.

// External Modules ----------------------------------------------------------

import { Router } from "express";

// Internal Modules ----------------------------------------------------------

import AuthorRouter from "./AuthorRouter";
import LibraryRouter from "./LibraryRouter";
import StoryRouter from "./StoryRouter";
import DevModeRouter from "./DevModeRouter";

// Public Classes ------------------------------------------------------------

export const ApiRouters = Router({
    strict: true,
})

// Static Routers ------------------------------------------------------------

ApiRouters.get("/", (req, res) => {
    res.send("Hello from Bookcase Server!");
})

// Model-specific Routers ----------------------------------------------------

ApiRouters.use("/authors", AuthorRouter);
ApiRouters.use("/devmode", DevModeRouter);
ApiRouters.use("/libraries", LibraryRouter);
ApiRouters.use("/stories", StoryRouter);

export default ApiRouters;
