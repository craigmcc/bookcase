// LibraryServices -----------------------------------------------------------

// Services implementation for Library models.

// External Modules ----------------------------------------------------------

import { FindOptions, Op } from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractServices from "./AbstractServices";
import Author from "../models/Author";
import Database from "../models/Database";
import Library from "../models/Library";
import Story from "../models/Story";
import * as SortOrder from "../models/SortOrder";
import { NotFound } from "../util/http-errors";
import { appendPagination } from "../util/query-parameters";

// Public Classes ------------------------------------------------------------

export class LibraryServices extends AbstractServices<Library> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<Library[]> {
        let options: FindOptions = appendQuery({
            order: SortOrder.Libraries
        }, query);
        return Library.findAll(options);
    }

    public async find(libraryId: number, query?: any): Promise<Library> {
        let options: FindOptions = appendQuery({
            where: { id: libraryId }
        }, query);
        let results = await Library.findAll(options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.find()");
        }
    }

    public async insert(library: Library): Promise<Library> {
        let transaction;
        try {
            transaction = await Database.transaction();
            let inserted: Library = await Library.create(library, {
                fields: fields,
                transaction: transaction
            });
            await transaction.commit();
            return inserted;
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    public async remove(libraryId: number): Promise<Library> {
        let removed = await Library.findByPk(libraryId);
        if (!removed) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.remove()");
        }
        let count = await Library.destroy({
            where: { id: libraryId }
        });
        if (count < 1) {
            throw new NotFound(
                `libraryId: Cannot remove Library ${libraryId}`,
                "LibraryServices.remove()");
        }
        return removed;
    }

    public async update(libraryId: number, library: Library): Promise<Library> {
        let transaction;
        try {
            transaction = await Database.transaction();
            library.id = libraryId;
            let result: [number, Library[]] = await Library.update(library, {
                fields: fieldsWithId,
                transaction: transaction,
                where: { id: libraryId }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `libraryId: Cannot update Library ${libraryId}`,
                    "LibraryServices.update()");
            }
            await transaction.commit();
            transaction = null;
            return await this.find(libraryId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** Library Lookups *****

    public async active(query?: any): Promise<Library[]> {
        let options: FindOptions = appendQuery({
            order: SortOrder.Libraries,
            where: {
                active: true
            }
        }, query);
        return Library.findAll(options);
    }

    public async exact(name: string, query?: any): Promise<Library> {
        let options: FindOptions = appendQuery({
            where: {
                name: name
            }
        }, query);
        let results = await Library.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Library '${name}'`,
                "LibraryServices.exact()");
        }
        return results[0];
    }


    public async name(name: string, query?: any): Promise<Library[]> {
        let options: FindOptions = appendQuery({
            order: SortOrder.Libraries,
            where: {
                name: { [Op.iLike]: `%${name}%` }
            }
        }, query);
        return Library.findAll(options);
    }

    // ***** Author Lookups *****

    public async authorsActive(libraryId: number, query?: any): Promise<Author[]> {
        let library = await Library.findByPk(libraryId, {
            include: [ Author ]
        });
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.authorsActive()");
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.Authors,
            where: {
                active: true,
            },
        }, query);
        return library.$get("authors", options);
    }

    public async authorsAll(libraryId: number, query?: any): Promise<Author[]> {
        let library = await Library.findByPk(libraryId, {
            include: [ Author ]
        });
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.authorsAll()");
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.Authors
        }, query);
        return library.$get("authors", options);
    }

    public async authorsExact(
        libraryId: number,
        firstName: string,
        lastName: string,
        query?: any
    ): Promise<Author> {
        let library = await Library.findByPk(libraryId, {
            include: [ Author ]
        });
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.authorsExact()");
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.Authors,
            where: {
                firstName: firstName,
                lastName: lastName,
            },
        }, query);
        let results = await library.$get("authors", options);
        if (results.length < 1) {
            throw new NotFound(
                `names: Missing Author '${firstName} ${lastName}'`,
                "LibraryServices.authorsExact()");
        }
        return results[0];
    }

    public async authorsName(
        libraryId: number, name: string, query?: any
    ): Promise<Author[]> {
        let library = await Library.findByPk(libraryId, {
            include: [ Author ]
        });
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryService.authorsName()");
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.Authors,
            where: {
                [Op.or]: {
                    firstName: {[Op.iLike]: `%${name}%`},
                    lastName: {[Op.iLike]: `%${name}%`},
                }
            },
        }, query);
        return library.$get("authors", options);
    }

    // ***** Story Lookups *****

    public async storiesActive(libraryId: number, query?: any): Promise<Story[]> {
        let library = await Library.findByPk(libraryId, {
            include: [ Story ]
        });
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.storiesActive()");
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.Stories,
            where: {
                active: true,
            },
        }, query);
        return library.$get("stories", options);
    }

    public async storiesAll(libraryId: number, query?: any): Promise<Story[]> {
        let library = await Library.findByPk(libraryId, {
            include: [ Author ]
        });
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.storiesAll()");
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.Stories
        }, query);
        return library.$get("stories", options);
    }

    public async storiesExact(
        libraryId: number, name: string, query?: any
    ): Promise<Story> {
        let library = await Library.findByPk(libraryId, {
            include: [ Author ]
        });
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.storiesExact()");
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.Authors,
            where: {
                name: name,
            },
        }, query);
        let results = await library.$get("stories", options);
        if (results.length < 1) {
            throw new NotFound(
                `name: Missing Story '${name}'`,
                "LibraryServices.storiesExact()");
        }
        return results[0];
    }

    public async storiesName(
        libraryId: number, name: string, query?: any
    ): Promise<Story[]> {
        let library = await Library.findByPk(libraryId, {
            include: [ Story ]
        });
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.storiesName()");
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.Stories,
            where: {
                name: {[Op.iLike]: `%${name}%`},
            },
        }, query);
        return library.$get("stories", options);
    }

}

export default new LibraryServices();

// Private Objects -----------------------------------------------------------

let appendQuery = function(options: FindOptions, query?: any): FindOptions {

    if (!query) {
        return options;
    }
    options = appendPagination(options, query);

    // Inclusion parameters
    let include = [];
    if ("" === query.withAuthors) {
        include.push(Author);
    }
    if ("" === query.withLibrary) {
        include.push(Library);
    }
    if ("" === query.withStories) {
        include.push(Story);
    }
    if (include.length > 0) {
        options.include = include;
    }

    return options;

}

let fields: string[] = [
    "active",
    "name",
    "notes",
];
let fieldsWithId: string[] = [
    ...fields,
    "id"
];

