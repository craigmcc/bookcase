// test-prisma/BaseUtils.ts

/**
 * Base utilities for Prisma-based functional tests of actions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    AccessToken,
    Author,
    Library,
    Prisma,
    RefreshToken,
    Series,
    Story,
    User,
    Volume,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as SeedData from "./SeedData";
import prisma from "../prisma";
//import {clearMapping} from "../oauth/OAuthMiddleware";
import {hashPassword} from "@/oauth/OAuthUtils";

// Public Objects ------------------------------------------------------------

export type OPTIONS = {
    withAccessTokens: boolean,
    withAuthors: boolean,
    withLibraries: boolean,
    withRefreshTokens: boolean,
    withSeries: boolean,
    withStories: boolean,
    withUsers: boolean,
    withVolumes: boolean,
}

/**
 * Base utilities for functional tests.
 */
export abstract class BaseUtils {

    /**
     * Erase the current database, then load seed data for the tables
     * selected in the options parameter.
     *
     * @param options                   Flags to select tables to be loaded
     */
    public async loadData(options: Partial<OPTIONS>): Promise<void> {

        // Clear any previous OAuth mapping for Library id -> scope
        //TODO: clearMapping();

        // Erase current (test) database contents completely
        // (Relies on "onDelete:cascade" settings in the schema)
        await prisma.library.deleteMany({});
        await prisma.user.deleteMany({});

        // Load users (and tokens) if requested
        if (options.withUsers) {
            await loadUsers(SeedData.USERS);
            const userSuperuser = await prisma.user.findUnique({
                where: {
                    username: SeedData.USER_USERNAME_SUPERUSER
                }
            });
            if (userSuperuser) {
                if (options.withAccessTokens) {
                    await loadAccessTokens(userSuperuser, SeedData.ACCESS_TOKENS_SUPERUSER);
                }
                if (options.withRefreshTokens) {
                    await loadRefreshTokens(userSuperuser, SeedData.REFRESH_TOKENS_SUPERUSER);
                }
            }
        }

        // If libraries are not requested, nothing else will be loaded
        let libraries: Library[] = [];
        if (options.withLibraries) {
            libraries = await loadLibraries(SeedData.LIBRARIES);
        } else {
            return;
        }

        // Storage for detailed data (if loaded)
        let authors0: Author[] = [];
        let authors1: Author[] = [];
        let series0: Series[] = [];
        let series1: Series[] = [];
        let stories0: Story[] = [];
        let stories1: Story[] = [];
        let volumes0: Volume[] = [];
        let volumes1: Volume[] = [];

        // Load top level detailed data as requested
        if (options.withAuthors) {
            authors0 = await loadAuthors(libraries[0], SeedData.AUTHORS_LIBRARY0);
            authors1 = await loadAuthors(libraries[1], SeedData.AUTHORS_LIBRARY1);
        }
        if (options.withSeries) {
            series0 = await loadSeries(libraries[0], SeedData.SERIES_LIBRARY0);
            series1 = await loadSeries(libraries[1], SeedData.SERIES_LIBRARY1);
        }
        if (options.withStories) {
            stories0 = await loadStories(libraries[0], SeedData.STORIES_LIBRARY0);
            stories1 = await loadStories(libraries[1], SeedData.STORIES_LIBRARY1);
        }
        if (options.withVolumes) {
            volumes0 = await loadVolumes(libraries[0], SeedData.VOLUMES_LIBRARY0);
            volumes1 = await loadVolumes(libraries[1], SeedData.VOLUMES_LIBRARY1);
        }

        // Load relationships if both related tables were requested
        if (options.withAuthors && options.withSeries) {
            loadAuthorsSeries(authors0[0], [series0[0]]);
            loadAuthorsSeries(authors0[1], [series0[0]]);
            loadAuthorsSeries(authors1[0], [series1[0]]);
            loadAuthorsSeries(authors1[1], [series1[0]]);
        }
        if (options.withAuthors && options.withStories) {
            loadAuthorsStories(authors0[0], [stories0[0], stories0[2]]);
            loadAuthorsStories(authors0[1], [stories0[1], stories0[2]]);
            loadAuthorsStories(authors1[0], [stories1[0], stories1[2]]);
            loadAuthorsStories(authors1[1], [stories1[1], stories1[2]]);
        }
        if (options.withAuthors && options.withVolumes) {
            loadAuthorsVolumes(authors0[0], [volumes0[0], volumes0[2]]);
            loadAuthorsVolumes(authors0[1], [volumes0[1], volumes0[2]]);
            loadAuthorsVolumes(authors1[0], [volumes1[0], volumes1[2]]);
            loadAuthorsVolumes(authors1[1], [volumes1[1], volumes1[2]]);
        }
        if (options.withSeries && options.withStories) {
            loadSeriesStories(series0[0], stories0);
            loadSeriesStories(series1[0], stories1);
        }
        if (options.withVolumes && options.withStories) {
            loadVolumesStories(volumes0[0], [stories0[0]]);
            loadVolumesStories(volumes0[1], [stories0[1]]);
            loadVolumesStories(volumes0[2], [stories0[0], stories0[1], stories0[2]]);
            loadVolumesStories(volumes1[0], [stories1[0]]);
            loadVolumesStories(volumes1[1], [stories1[1]]);
            loadVolumesStories(volumes1[2], [stories1[0], stories1[1], stories1[2]]);
        }

    }

}

export default BaseUtils;

// Private Methods -----------------------------------------------------------

const hashedPassword = async (password: string | undefined): Promise<string> => {
    return hashPassword(password ? password : "");
}

const loadAccessTokens = async (user: User, accessTokens: Prisma.AccessTokenUncheckedCreateInput[]): Promise<AccessToken[]> => {
    let results: AccessToken[] = [];
    try {
        for (const accessToken of accessTokens) {
            accessToken.userId = user.id;
            results.push(await prisma.accessToken.create({ data: accessToken }));
        }
        return results;
    } catch (error) {
        console.info(`  Reloading AccessTokens for User '${user.username}' ERROR`, error);
        throw error;
    }
}

const loadAuthors = async (library: Library, authors: Prisma.AuthorUncheckedCreateInput[]): Promise<Author[]> => {
    let results: Author[] = [];
    try {
        for (const author of authors) {
            author.libraryId = library.id;
            results.push(await prisma.author.create({data: author}));
        }
        return results;
    } catch (error) {
        console.info(`  Reloading Authors for Library '${library.name}' ERROR`, error);
        throw error;
    }
}

const loadAuthorsSeries = async (author: Author, serieses: Series[]): Promise<void> => {
    for (const series of serieses) {
        await prisma.authorsSeries.create({
            data: {
                authorId: author.id,
                seriesId: series.id,
            }
        });
    }
}

const loadAuthorsStories = async (author: Author, stories: Story[]): Promise<void> => {
    for (const story of stories) {
        await prisma.authorsStories.create({
            data: {
                authorId: author.id,
                storyId: story.id,
            }
        });
    }
}

const loadAuthorsVolumes = async (author: Author, volumes: Volume[]): Promise<void> => {
    for (const volume of volumes) {
        await prisma.authorsVolumes.create({
            data: {
                authorId: author.id,
                volumeId: volume.id,
            }
        });
    }
}

const loadLibraries = async (libraries: Prisma.LibraryUncheckedCreateInput[]): Promise<Library[]> =>
{
    let results: Library[] = [];
    try {
        for (const library of libraries) {
            results.push(await prisma.library.create({ data: library}));
        }
    } catch (error) {
        console.info("  Reloading Libraries ERROR", error);
    }
    return results;
}

const loadRefreshTokens = async (user: User, refreshTokens: Prisma.RefreshTokenUncheckedCreateInput[]): Promise<RefreshToken[]> => {
    let results: RefreshToken[] = [];
    try {
        for (const refreshToken of refreshTokens) {
            refreshToken.userId = user.id;
            results.push(await prisma.refreshToken.create({ data: refreshToken }));
        }
        return results;
    } catch (error) {
        console.info(`  Reloading RefreshTokens for User '${user.username}' ERROR`, error);
        throw error;
    }
}

const loadSeries = async (library: Library, serieses: Prisma.SeriesUncheckedCreateInput[]): Promise<Series[]> => {
    let results: Series[] = [];
    try {
        for (const series of serieses) {
            series.libraryId = library.id;
            results.push(await prisma.series.create({ data: series }));
        }
        return results;
    } catch (error) {
        console.info(`  Reloading Series for Library '${library.name}' ERROR`, error);
        throw error;
    }
}

const loadSeriesStories = async (series: Series, stories: Story[]): Promise<void> => {
    let ordinal = 1;
    for (const story of stories) {
        await prisma.seriesStories.create({
            data: {
                ordinal: ordinal++,
                seriesId: series.id,
                storyId: story.id,
            }
        });
    }
}

const loadStories = async (library: Library, stories: Prisma.StoryUncheckedCreateInput[]): Promise<Story[]> => {
    let results: Story[] = [];
    try {
        for (const story of stories) {
            story.libraryId = library.id;
            results.push(await prisma.story.create({ data: story }));
        }
        return results;
    } catch (error) {
        console.info(`  Reloading Stories for Library '${library.name}' ERROR`, error);
        throw error;
    }
}

const loadUsers = async (users: Prisma.UserUncheckedCreateInput[]): Promise<User[]> => {
    let results: User[] = [];
    /*
        // For tests, the unhashed password is the same as the username
        const promises = users.map(user => hashedPassword(user.username));
        const hashedPasswords: string[] = await Promise.all(promises);
        for (let i = 0; i < users.length; i++) {
            users[i].password = hashedPasswords[i];
        }
    */
    try {
        for (const user of users) {
            // For tests, the unhashed password is the same as the username
            user.password = await hashedPassword(user.username);
            results.push(await prisma.user.create({ data: user }));
        }
        return results;
    } catch (error) {
        console.info("  Reloading Users ERROR", error);
        throw error;
    }
}

const loadVolumes = async (library: Library, volumes: Prisma.VolumeUncheckedCreateInput[]): Promise<Volume[]> => {
    let results: Volume[] = [];
    try {
        for (const volume of volumes) {
            volume.libraryId = library.id;
            results.push(await prisma.volume.create({ data: volume }));
        }
        return results;
    } catch (error) {
        console.info(`  Reloading Volumes for Library '${library.name}' ERROR`, error);
        throw error;
    }
}

const loadVolumesStories = async (volume: Volume, stories: Story[]): Promise<void> => {
    for (const story of stories) {
        await prisma.volumesStories.create({
            data: {
                storyId: story.id,
                volumeId: volume.id,
            }
        });
    }
}
