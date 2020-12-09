// StoryServices -------------------------------------------------------------

// Services implementation for Story models.

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

export class StoryServices extends AbstractServices<Story> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<Story[]> {
        let options: FindOptions = appendQuery({
            order: SortOrder.Stories
        }, query);
        return Story.findAll(options);
    }

    public async find(storyId: number, query?: any): Promise<Story> {
        let options: FindOptions = appendQuery({
            where: { id: storyId }
        }, query);
        let results = await Story.findAll(options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.find()");
        }
    }

    public async insert(story: Story): Promise<Story> {
        let transaction;
        try {
            transaction = await Database.transaction();
            let inserted: Story = await Story.create(story, {
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

    public async remove(storyId: number): Promise<Story> {
        let removed = await Story.findByPk(storyId);
        if (!removed) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.remove()");
        }
        let count = await Story.destroy({
            where: { id: storyId }
        });
        if (count < 1) {
            throw new NotFound(
                `storyId: Cannot remove Story ${storyId}`,
                "StoryServices.remove()");
        }
        return removed;
    }

    public async update(storyId: number, story: Story): Promise<Story> {
        let transaction;
        try {
            transaction = await Database.transaction();
            story.id = storyId;
            let result: [number, Story[]] =
                await Story.update(story, {
                    fields: fieldsWithId,
                    transaction: transaction,
                    where: { id: storyId }
                });
            if (result[0] < 1) {
                throw new NotFound(
                    `storyId: Cannot update Story ${storyId}`,
                    "StoryServices.update()");
            }
            await transaction.commit();
            return await this.find(storyId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** Author-Story Relationships (Many-Many) *****

    public async authorsAdd(storyId: number, authorId: number): Promise<Author> {
        let story = await Story.findByPk(storyId);
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.authorsAdd()");
        }
        let author = await Author.findByPk(authorId, {
            include: [ Story ]
        });
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "StoryServices.authorsAdd()");
        }
        if (author.libraryId !== story.libraryId) {
            throw new BadRequest(
                `libraryId: Story ${storyId}`
                    + ` belongs to Library ${story.libraryId}`
                    + ` but Author ${authorId} belongs to Library ${author.libraryId}`,
                "StoryServices.authorsAdd()");
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
                "StoryServices.authorsAdd()");
        }
        await story.$add("authors", author);
        return author;
    }

    public async authorsAll(storyId: number, query?: any): Promise<Author[]> {
        let story = await Story.findByPk(storyId);
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.authorsAll()");
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.Authors
        }, query);
        return story.$get("authors", options);
    }

    // No authorsExact() is possible because names are not unique

    public async authorsName(
        storyId: number, name: string, query?: any
    ): Promise<Author[]> {
        let story = await Story.findByPk(storyId);
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.authorsName()");
        }
        let options: FindOptions = appendQuery({
            where: {
                [Op.or]: {
                    firstName: {[Op.iLike]: `%${name}%`},
                    lastName: {[Op.iLike]: `%${name}%`},
                }
            }
        }, query);
        return story.$get("authors", options);
    }

    public async authorsRemove(storyId: number, authorId: number): Promise<Author> {
        let story = await Story.findByPk(storyId);
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.authorsRemove()");
        }
        let author = await Author.findByPk(authorId);
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "StoryServices.authorsRemove()");
        }
        let count = await AuthorStory.count({
            where: {
                authorId: authorId,
                storyId: storyId
            }
        });
        if (count === 0) {
            throw new NotFound(
                `authorId: Author ${authorId}`
                    + ` is not associated with Story ${storyId}`,
                "StoryServices.authorsRemove()");
        }
        await story.$remove("authors", author);
        return author;
    }

}

export default new StoryServices();

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
    if (include.length > 0) {
        options.include = include;
    }

    return options;

}

let fields: string[] = [
    "active",
    "libraryId",
    "name",
    "notes",
];
let fieldsWithId: string[] = [
    ...fields,
    "id"
];

