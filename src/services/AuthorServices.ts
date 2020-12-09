// AuthorServices ------------------------------------------------------------

// Services implementation for Author models.

// External Modules ----------------------------------------------------------

import { FindOptions, Op } from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractServices from "./AbstractServices";
import Author from "../models/Author";
import AuthorStory from "../models/AuthorStory";
import Database from "../models/Database";
import Library from "../models/Library";
import Story from "../models/Story";
import * as SortOrder from "../models/SortOrder";
import { BadRequest, NotFound, NotUnique } from "../util/http-errors";
import { appendPagination } from "../util/query-parameters";

// Public Classes ------------------------------------------------------------

export class AuthorServices extends AbstractServices<Author> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<Author[]> {
        let options: FindOptions = appendQuery({
            order: SortOrder.Authors
        }, query);
        return Author.findAll(options);
    }

    public async find(authorId: number, query?: any): Promise<Author> {
        let options: FindOptions = appendQuery({
            where: { id: authorId }
        }, query);
        let results = await Author.findAll(options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.find()");
        }
    }

    public async insert(author: Author): Promise<Author> {
        let transaction;
        try {
            transaction = await Database.transaction();
            let inserted: Author = await Author.create(author, {
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

    public async remove(authorId: number): Promise<Author> {
        let removed = await Author.findByPk(authorId);
        if (!removed) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.remove()");
        }
        let count = await Author.destroy({
            where: { id: authorId }
        });
        if (count < 1) {
            throw new NotFound(
                `authorId: Cannot remove Author ${authorId}`,
                "AuthorServices.remove()");
        }
        return removed;
    }

    public async update(authorId: number, author: Author): Promise<Author> {
        let transaction;
        try {
            transaction = await Database.transaction();
            author.id = authorId;
            let result: [number, Author[]] =
                await Author.update(author, {
                    fields: fieldsWithId,
                    transaction: transaction,
                    where: { id: authorId }
                });
            if (result[0] < 1) {
                throw new NotFound(
                    `authorId: Cannot update Author ${authorId}`,
                    "AuthorServices.update()");
            }
            await transaction.commit();
            transaction = null;
            return await this.find(authorId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** Author-Story Relationships (Many-Many) *****

    public async storiesAdd(authorId: number, storyId: number): Promise<Story> {
        let author = await Author.findByPk(authorId, {
            include: [ Story ]
        });
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.storiesAdd()");
        }
        let story = await Story.findByPk(storyId);
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "AuthorServices.storiesAdd()");
        }
        if (author.libraryId !== story.libraryId) {
            throw new BadRequest(
                `libraryId: Author ${authorId}`
                     + ` belongs to Library ${author.libraryId}`
                 + ` but Story ${storyId} belongs to Library ${story.libraryId}`,
                "AuthorServices.storiesAdd()");
        }
        let count = await AuthorStory.count({
            where: {
                authorId: authorId,
                storyId: storyId
            }
        });
        if (count > 0) {
            throw new NotUnique(
                `storyId: Story ${storyId} is already`
                    + ` associated with Author ${authorId}`,
                "AuthorServices.storiesAdd()");
        }
        await author.$add("stories", story);
        return story;
    }

    public async storiesAll(authorId: number, query?: any): Promise<Story[]> {
        let author = await Author.findByPk(authorId, {
            include: [ Story ]
        });
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.storiesAll()");
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.Stories
        }, query);
        return author.$get("stories", options);
    }

    // No storiesExact() is possible because names are not unique

    public async storiesName(
        authorId: number, name: string, query?: any
    ) : Promise<Story[]> {
        let author = await Author.findByPk(authorId, {
            include: [ Story ]
        });
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.storiesName()");
        }
        let options: FindOptions = appendQuery({
            where: { name: {[Op.iLike]: `%${name}%`} }
        }, query);
        return author.$get("stories", options);
    }

    public async storiesRemove(authorId: number, storyId: number): Promise<Story> {
        let author = await Author.findByPk(authorId);
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.storiesRemove()");
        }
        let story = await Story.findByPk(storyId);
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "AuthorServices.storiesRemove()");
        }
        let count = await AuthorStory.count({
            where: {
                authorId: authorId,
                storyId: storyId
            }
        });
        if (count === 0) {
            throw new BadRequest(
                `storyId: Story ${storyId}`
                    + ` is not associated with Author ${authorId}`,
                "AuthorServices.storiesRemove()");
        }
        await author.$remove("stories", story);
        return story;
    }

}

export default new AuthorServices();

// Private Objects -----------------------------------------------------------

let appendQuery = function(options: FindOptions, query?: any): FindOptions {

    if (!query) {
        return options;
    }
    options = appendPagination(options, query);

    // Inclusion parameters
    let include = [];
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
    "firstName",
    "lastName",
    "libraryId",
    "notes",
];
let fieldsWithId: string[] = [
    ...fields,
    "id"
];

