// LibraryController ---------------------------------------------------------

// Express controller for Library models.  Will be a child of ApiController.

// External Modules ----------------------------------------------------------

import { Request, Response } from "express";
import { Controller, Delete, Get, Post, Put } from "@overnightjs/core";
//import { Logger } from "@overnightjs/logger";

// Internal Modules ----------------------------------------------------------

import LibraryServices from "../services/LibraryServices";

// Public Objects ------------------------------------------------------------

@Controller("libraries")
export class LibraryController {

    // Model-Specific Routes (no libraryId) ----------------------------------

    @Get("active")
    private async active(req: Request, res: Response) {
        return res.send(await LibraryServices.active(
            req.query
        ));
    }

    @Get("exact/:name")
    private async exact(req: Request, res: Response) {
        return res.send(await LibraryServices.exact(
            req.params.name,
            req.query
        ));
    }

    @Get("name/:name")
    private async name(req: Request, res: Response) {
        return res.send(await LibraryServices.name(
            req.params.name,
            req.query
        ));
    }

    // Standard CRUD Routes --------------------------------------------------

    @Get("")
    private async all(req: Request, res: Response) {
        return res.send(await LibraryServices.all(
            req.query
        ));
    }

    @Post("")
    private async insert(req: Request, res: Response) {
        return res.send(await LibraryServices.insert(
            req.body
        ));
    }

    @Delete(":libraryId")
    private async remove(req: Request, res: Response) {
        return res.send(await LibraryServices.remove(
            parseInt(req.params.libraryId)
        ));
    }

    @Get(":libraryId")
    private async find(req: Request, res: Response) {
        return res.send(await LibraryServices.find(
            parseInt(req.params.libraryId),
            req.query
        ));
    }

    @Put(":libraryId")
    private async update(req: Request, res: Response) {
        return res.send(await LibraryServices.update(
            parseInt(req.params.libraryId),
            req.body
        ))
    }

    // Library->Author Routes ------------------------------------------------

    // TODO

    // Library->Story Routes -------------------------------------------------

    // TODO

}

export default LibraryController;
