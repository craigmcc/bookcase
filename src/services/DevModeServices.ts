// DevModeServices -----------------------------------------------------------

// Developer mode services for resynchronizing database metadata
// and reloading seed data.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Database from "../models/Database";
import Library from "../models/Library";
import Story from "../models/Story";
import * as SeedData from "../util/seed-data";
import {oauthUsers} from "../util/seed-data";
import OAuthUser from "../oauth/OAuthUser";

// Public Functions ----------------------------------------------------------

export const reload = async (query: any): Promise<any> => {
    await resync(query);
    console.info("DevModeServices.reload() in progress");

    let libraries = await loadLibraries(SeedData.librariesData);
    let libraryFirst: Library = libraries[0];
    let librarySecond: Library = libraries[1];

    let authorsFirst =
        await loadAuthors(libraryFirst.id, SeedData.authorsFirst);
    let authorsSecond =
        await loadAuthors(librarySecond.id, SeedData.authorsSecond);

    let oauthUsers = await loadOAuthUsers(SeedData.oauthUsers);

    let storiesFirst =
        await loadStories(libraryFirst.id, authorsFirst, SeedData.storiesFirst);
    let storiesSecond =
        await loadStories(librarySecond.id, authorsSecond, SeedData.storiesSecond);

    console.info("DevModeServices.reload() is complete");
    return {
        authors: await Author.findAll(),
        libraries: await Library.findAll(),
        oauthUsers: await OAuthUser.findAll(),
        stories: await Story.findAll(),
    }
}

export const resync = async (query: any): Promise<any> => {
    console.info("DevModeServices.resync() in progress");
    await Database.sync({
        force: true
    });
    console.info("DevModeServices.resync() is complete");
    return {
        authors: await Author.findAll(),
        libraries: await Library.findAll(),
        stories: await Story.findAll(),
    }
}

// Private Functions ---------------------------------------------------------

const loadAuthors = async (libraryId: number | undefined, authors: any[]): Promise<Author[]> => {
    authors.forEach(author => {
        author.libraryId = libraryId;
    })
    return Author.bulkCreate(authors, {
        validate: false
    });
}

const loadLibraries = async (libraries: any[]): Promise<Library[]> => {
    return Library.bulkCreate(libraries, {
        validate: false
    });
}

const loadOAuthUsers = async (oauthUsers: any[]): Promise<OAuthUser[]> => {
    return OAuthUser.bulkCreate(oauthUsers, {
        validate: false
    });
}

const loadStories = async(
        libraryId: number | undefined,
        authors: Author[],
        stories: any[]
    ): Promise<Story[]> => {
    stories.forEach((story, index) => {
        switch (index) {
            case 0: story.authorId = authors[0].id; break;
            case 1: story.authorId = authors[1].id; break;
            case 2: story.authorId = authors[0].id; break;
            default: break;
        }
        // TODO: primary author must be established separately
        story.libraryId = libraryId;
    });
    let results = await Story.bulkCreate(stories, {
        validate: false
    });
    await authors[0].$add("stories", results[0]);
    await authors[0].$add("stories", results[2]);
    await authors[1].$add("stories", results[1]);
    await authors[1].$add("stories", results[2]);
    return results;
}

