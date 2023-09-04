//"use server"

// actions/StoryActions.ts

/**
 * Server side actions for Story model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "./AuthorActions";
import * as LibraryActions from "./LibraryActions";
import * as SeriesActions from "./SeriesActions";
import * as VolumeActions from "./VolumeActions";
import prisma from "@/prisma";
import {
    StoryAllOptions,
    StoryFindOptions,
    StoryIncludeOptions,
    StoryMatchOptions,
    StoryPlus,
} from "@/types/models/Story";
import {PaginationOptions} from "@/types/types";
import {NotFound, NotUnique, ServerError} from "@/util/HttpErrors";
import logger from "@/util/ServerLogger";

// Public Actions ------------------------------------------------------------

/**
 * Return all Story instances that match the specified criteria.
 *
 * @param libraryId                     ID of the Library being queried
 * @param options                       Optional match query parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (libraryId: number, options?: StoryAllOptions): Promise<StoryPlus[]> => {
    logger.info({
        context: "StoryActions.all",
        libraryId: libraryId,
        options: options,
    });
    const args: Prisma.StoryFindManyArgs = {
        // cursor???
        // distinct???
        include: include(options),
        orderBy: orderBy(options),
        select: select(options),
        skip: skip(options),
        take: take(options),
        where: where(libraryId, options),
    }
    try {
        const results = await prisma.story.findMany(args);
        return results as unknown as StoryPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "StoryActions.all",
        );
    }
}

/**
 * Connect the specified Author to this Story.
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the Story being connected to
 * @param authorId                      ID of the Author being connected
 * @param principal                     Is this a principal Author of this Story?
 *
 * @throws NotFound                     If the specified Story or Author is not found
 * @throws NotUnique                    If this Author and Story are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const authorConnect =
    async (libraryId: number, storyId: number, authorId: number, principal?: boolean): Promise<StoryPlus> =>
    {
        logger.info({
            context: "StoryActions.authorConnect",
            libraryId: libraryId,
            storyId: storyId,
            authorId: authorId,
            principal: principal,
        });
        const story = await find(libraryId, storyId);
        await AuthorActions.find(libraryId, authorId);
        try {
            await prisma.authorsStories.create({
                data: {
                    authorId: authorId,
                    principal: principal,
                    storyId: storyId,
                }
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Author ID ${authorId} and Story ID ${storyId} are already connected`,
                        "StoryAction.authorConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "StoryActions.authorConnect()",
            );
        }
    }

/**
 * Disconnect the specified Author from this Story.
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the Story being disconnected from
 * @param authorId                      ID of the Author being disconnected
 *
 * @throws NotFound                     If the specified Story or Author is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const authorDisconnect =
    async (libraryId: number, storyId: number, authorId: number): Promise<StoryPlus> =>
    {
        logger.info({
            context: "StoryActions.authorDisconnect",
            libraryId: libraryId,
            storyId: storyId,
            authorId: authorId,
        });
        const story = await find(libraryId, storyId);
        await AuthorActions.find(libraryId, authorId);
        try {
            await prisma.authorsStories.delete({
                where: {
                    authorId_storyId: {
                        authorId: authorId,
                        storyId: storyId,
                    }
                },
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Author ID ${authorId} and Story ID ${storyId} are not connected`,
                        "StoryActions.authorDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "StoryActions.authorDisconnect()",
            );
        }
    }

/**
 * Return the Story instance with the specified name, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param name                          Name of the requested Story
 * @param options                       Optional query parameters
 *
 * @throws NotFound                     If no such Story is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (libraryId: number, name: string, options?: StoryFindOptions): Promise<StoryPlus> => {
    try {
        logger.info({
            context: "StoryActions.exact",
            libraryId: libraryId,
            name: name,
            options: options,
        });
        const result = await prisma.story.findUnique({
            include: include(options),
            where: {
                libraryId_name: {
                    libraryId: libraryId,
                    name: name,
                }
            }
        });
        if (result) {
            return result as unknown as StoryPlus;
        } else {
            throw new NotFound(
                `name: Missing Story '${name}'`,
                "StoryActions.exact"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "StoryActions.exact",
            );
        }
    }
}

/**
 * Return the Story instance with the specified storyId, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the requested Story
 * @param options                       Optional query options
 *
 * @throws NotFound                     If no such Story is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, storyId: number, options?: StoryFindOptions): Promise<StoryPlus> => {
    try {
        logger.info({
            context: "StoryActions.find",
            libraryId: libraryId,
            storyId: storyId,
            options: options,
        });
        const result = await prisma.story.findUnique({
            include: include(options),
            where: {
                id: storyId,
                libraryId: libraryId,
            }
        });
        if (result) {
            return result as unknown as StoryPlus;
        } else {
            throw new NotFound(
                `id: Missing Story ${storyId}`,
                "StoryActions.find"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "StoryActions.find",
            );
        }
    }
}

/**
 * Create and return a new Story instance, if it satisfies validation.
 *
 * @param libraryId                     ID of the owning Library
 * @param story                         Story to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (libraryId: number, story: Prisma.StoryUncheckedCreateInput): Promise<StoryPlus> => {
    logger.info({
        context: "StoryActions.insert",
        libraryId: libraryId,
        story: story,
    });
    await LibraryActions.find(libraryId);
    if (!await uniqueName(libraryId, null, story.name)) {
        throw new NotUnique(
            `name: Story name '${story.name}' is already in use in this Library`,
            "StoryActions.insert",
        );
    }
    const args: Prisma.StoryUncheckedCreateInput = {
        ...story,
        id: undefined,                  // Just in case
        libraryId: libraryId,           // No cheating
    }
    try {
        const result = await prisma.story.create({
            data: args,
        });
        return result as unknown as StoryPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "StoryActions.insert",
        );
    }
}

/**
 * Remove and return the specified Story.
 *
 * @param libraryId                     ID of the owning Library
 * @param storyId                       ID of the Story to be removed
 *
 * @throws NotFound                     If the specified Library or Story cannot be found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (libraryId: number, storyId: number): Promise<StoryPlus> => {
    try {
        logger.info({
            context: "StoryActions.remove",
            libraryId: libraryId,
            storyId: storyId,
        });
        const story = await find(libraryId, storyId);
        await prisma.story.delete({
            where: { id: storyId },
        });
        return story;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "StoryActions.remove",
        );
    }
}

/**
 * Connect the specified Series to this Story.
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the Story being connected to
 * @param seriesId                      ID of the Series being connected
 * @param ordinal                       Optional order of this Story in this Series
 *
 * @throws NotFound                     If the specified Story or Volume is not found
 * @throws NotUnique                    If this Volume and Story are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const seriesConnect =
    async (libraryId: number, storyId: number, seriesId: number, ordinal?: number): Promise<StoryPlus> =>
    {
        logger.info({
            context: "StoryActions.seriesConnect",
            libraryId: libraryId,
            storyId: storyId,
            ordinal: ordinal,
        })
        const story = await find(libraryId, storyId);
        await SeriesActions.find(libraryId, seriesId);
        try {
            await prisma.seriesStories.create({
                data: {
                    ordinal: ordinal ? ordinal : undefined,
                    seriesId: seriesId,
                    storyId: storyId,
                }
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Series ID ${seriesId} and Story ID ${storyId} are already connected`,
                        "StoryActions.seriesConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "StoryActions.seriesConnect()",
            );
        }
    }

/**
 * Disconnect the specified Series from this Story.
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the Story being disconnected from
 * @param seriesId                      ID of the Series being disconnected
 *
 * @throws NotFound                     If the specified Story or Author is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const seriesDisconnect =
    async (libraryId: number, storyId: number, seriesId: number): Promise<StoryPlus> =>
    {
        logger.info({
            context: "StoryActions.seriesDisconnect",
            libraryId: libraryId,
            storyId: storyId,
            seriesId: seriesId,
        });
        const story = await find(libraryId, storyId);
        await SeriesActions.find(libraryId, seriesId);
        try {
            await prisma.seriesStories.delete({
                where: {
                    seriesId_storyId: {
                        seriesId: seriesId,
                        storyId: storyId,
                    }
                },
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Series ID ${seriesId} and Story ID ${storyId} are not connected`,
                        "StoryActions.seriesDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "StoryActions.seriesDisconnect()",
            );
        }
    }

/**
 * Update and return the specified Story.
 *
 * @param libraryId                     ID of the owning Library
 * @param storyId                       ID of the Story to be updated
 * @param story                         Updated data
 *
 * @throws NotFound                     If the specified Library or Story cannot be found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error is thrown
 */
export const update = async (libraryId: number, storyId: number, story: Prisma.StoryUncheckedUpdateInput): Promise<StoryPlus> => {
    logger.info({
        context: "StoryActions.update",
        libraryId: libraryId,
        storyId: storyId,
        story: story,
    });
    await find(libraryId, storyId); // May throw NotFound
    if (story.name && (typeof story.name === "string") &&
        (!await uniqueName(libraryId, storyId, story.name))) {
        throw new NotUnique(
            `name: Story name '${story.name}' is already in use in this Library`,
            "StoryActions.update",
        );
    }
    try {
        const result = await prisma.story.update({
            data: {
                ...story,
                id: storyId,            // No cheating
                libraryId: libraryId,   // No cheating`
            },
            where: { id: storyId },
        });
        return result as unknown as StoryPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "StoryActions.update",
        );
    }
}

/**
 * Connect the specified Volume to this Story.
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the Story being connected to
 * @param volumeId                      ID of the Volume being connected
 *
 * @throws NotFound                     If the specified Story or Volume is not found
 * @throws NotUnique                    If this Volume and Story are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const volumeConnect =
    async (libraryId: number, storyId: number, volumeId: number): Promise<StoryPlus> =>
    {
        logger.info({
            context: "StoryActions.volumeConnect",
            libraryId: libraryId,
            storyId: storyId,
            volumeId: volumeId,
        });
        const story = await find(libraryId, storyId);
        await VolumeActions.find(libraryId, volumeId);
        try {
            await prisma.volumesStories.create({
                data: {
                    volumeId: volumeId,
                    storyId: storyId,
                }
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Volume ID ${volumeId} and Story ID ${storyId} are already connected`,
                        "StoryAction.volumeConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "StoryActions.volumeConnect()",
            );
        }
    }

/**
 * Disconnect the specified Volume from this Story.
 *
 * @param libraryId                     ID of the Library being queried
 * @param storyId                       ID of the Story being disconnected from
 * @param volumeId                      ID of the Volume being disconnected
 *
 * @throws NotFound                     If the specified Story or Author is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const volumeDisconnect =
    async (libraryId: number, storyId: number, volumeId: number): Promise<StoryPlus> =>
    {
        logger.info({
            context: "StoryActions.volumeDisconnect",
            libraryId: libraryId,
            storyId: storyId,
            volumeId: volumeId,
        });
        const story = await find(libraryId, storyId);
        await VolumeActions.find(libraryId, volumeId);
        try {
            await prisma.volumesStories.delete({
                where: {
                    volumeId_storyId: {
                        volumeId: volumeId,
                        storyId: storyId,
                    }
                },
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Volume ID ${volumeId} and Story ID ${storyId} are not connected`,
                        "StoryActions.volumeDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "StoryActions.volumeDisconnect()",
            );
        }
    }

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * options, if they were specified.
 */
export const include = (options?: StoryIncludeOptions): Prisma.StoryInclude | undefined => {
    if (!options) {
        return undefined;
    }
    const include: Prisma.StoryInclude = {};
    if (options.withAuthors) {
        include.authorsStories = {
            include: {
                author: true,
//                story: true,
            }
        }
    }
    if (options.withLibrary) {
        include.library = true;
    }
    if (options.withSeries) {
        include.seriesStories = {
            include: {
                series: true,
//                story: true,
            }
        }
    }
    if (options.withVolumes) {
        include.volumesStories = {
            include: {
//                story: true,
                volume: true,
            }
        }
    }
    if (Object.keys(include).length > 0) {
        return include;
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "orderBy" options from the specified query
 * options, if any were specified.
 */
export const orderBy = (options?: any): Prisma.StoryOrderByWithRelationInput => {
    return {
        name: "asc",
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * options, if any were specified.
 */
export const select = (options?: any): Prisma.StorySelect | undefined => {
    return undefined; // TODO - for future use
}

/**
 * Calculate and return the "skip" options (pre-prisma called "offset")
 * from the specified query options, if any were specified.
 */
export const skip = (options?: PaginationOptions): number | undefined => {
    if (!options) {
        return undefined;
    }
    if (options.offset) {
        return Number(options.offset);
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "take" options (pre-prisma called "limit")
 * from the specified query options, if any were specified.
 */
export const take = (options?: PaginationOptions): number | undefined => {
    if (!options) {
        return undefined;
    }
    if (options.limit) {
        return Number(options.limit);
    } else {
        return undefined;
    }
}

/**
 * Return true if the proposed name is unique.
 *
 * @param libraryId                     ID of the existing Library (required)
 * @param storyId                       ID of the existing Story (if any)
 * @param name                          Proposed name
 */
export const uniqueName = async(libraryId: number, storyId: number | null, name: string): Promise<boolean> => {
    try {
        const args: Prisma.StoryFindManyArgs = {};
        if (storyId) {
            args.where = {
                id: {
                    not: storyId,
                },
                libraryId: libraryId,
                name: name,
            }
        } else {
            args.where = {
                libraryId: libraryId,
                name: name,
            }
        }
        const results = await prisma.story.findMany(args);
        return (results.length === 0);
    } catch (error) {
        throw new ServerError(
            error as Error,
            "StoryActions.uniqueName",
        );
    }
}

/**
 * Calculate and return the "where" options from the specified query
 * options, if any were specified.
 */
export const where = (libraryId: number, options?: StoryMatchOptions): Prisma.StoryWhereInput | undefined => {
    const where: Prisma.StoryWhereInput = {
        libraryId: libraryId,
    }
    if (!options) {
        return where;
    }
    if (typeof options.active !== "undefined") {
        where.active = options.active;
    }
    if (options.name) {
        // Wildcard match
        where.name = {
            contains: options.name,
            mode: "insensitive",
        }
    }
    return where;
}

