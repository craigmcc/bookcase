//"use server"

// actions/SeriesActions.ts

/**
 * Server side actions for Series model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "./AuthorActions";
import * as LibraryActions from "./LibraryActions";
import * as StoryActions from "./StoryActions";
import prisma from "@/prisma";
import {AuthorAllOptions, AuthorPlus} from "@/types/models/Author";
import {
    SeriesAllOptions,
    SeriesFindOptions,
    SeriesIncludeOptions,
    SeriesMatchOptions,
    SeriesPlus,
} from "@/types/models/Series";
import {StoryAllOptions, StoryPlus} from "@/types/models/Story";
import {PaginationOptions} from "@/types/types";
import {NotFound, NotUnique, ServerError} from "@/util/HttpErrors";
import logger from "@/util/ServerLogger";

// Public Actions ------------------------------------------------------------

/**
 * Return all Series instances that match the specified criteria.
 *
 * @param libraryId                     ID of the Library being queried
 * @param options                       Optional match query parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (libraryId: number, options?: SeriesAllOptions): Promise<SeriesPlus[]> => {
    logger.info({
        context: "SeriesActions.all",
        libraryId: libraryId,
        options: options,
    });
    const args: Prisma.SeriesFindManyArgs = {
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
        const results = await prisma.series.findMany(args);
        return results as unknown as SeriesPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "SeriesActions.all",
        );
    }
}

/**
 * Connect the specified Author to this Series.
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the Series being connected to
 * @param authorId                      ID of the Author being connected
 * @param principal                     Is this Author a principal Author of this Series?
 */
export const authorConnect =
    async (libraryId: number, seriesId: number, authorId: number, principal?: boolean): Promise<SeriesPlus> =>
    {
        logger.info({
            context: "SeriesActions.authorConnect",
            libraryId: libraryId,
            seriesId: seriesId,
            authorId: authorId,
            principal: principal,
        });
        const series = await find(libraryId, seriesId);
        await AuthorActions.find(libraryId, authorId);
        try {
            await prisma.authorsSeries.create({
                data: {
                    authorId: authorId,
                    principal: (typeof principal !== "undefined") ? principal : undefined,
                    seriesId: seriesId,
                }
            });
            return series;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Series ID ${seriesId} and Author ID ${authorId} are already connected`,
                        "SeriesActions.authorConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "SeriesActions.authorConnect()",
            );

        }
    }

/**
 * Disconnect the specified Author from this Series.
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the Series being disconnected from
 * @param authorId                      ID of the Author being disconnected
 *
 * @throws NotFound                     If the specified Author or Story is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const authorDisconnect =
    async (libraryId: number, seriesId: number, authorId: number): Promise<SeriesPlus> =>
    {
        logger.info({
            context: "SeriesActions.authorDisconnect",
            libraryId: libraryId,
            seriesId: seriesId,
            authorId: authorId,
        });
        const series = await find(libraryId, seriesId);
        await AuthorActions.find(libraryId, authorId);
        try {
            await prisma.authorsSeries.delete({
                where: {
                    authorId_seriesId: {
                        authorId: authorId,
                        seriesId: seriesId,
                    }
                },
            });
            return series;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Series ID ${seriesId} and Author ID ${authorId} are not connected`,
                        "SeriesActions.seriesDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "AuthorActions.seriesDisconnect",
            );
        }

    }

/**
 * Return the Authors that are connected with this Series.
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the Series for the requested Authors
 * @param options                       Optional match query options
 *
 * @throws NotFound                     If the specified Library or Series is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const authors =
    async (libraryId: number, seriesId: number, options?: AuthorAllOptions): Promise<AuthorPlus[]> => {
        logger.info({
            context: "SeriesActions.authors",
            libraryId: libraryId,
            seriesId: seriesId,
            options: options,
        });
        await find(libraryId, seriesId);
        try {
            const items = await prisma.authorsSeries.findMany({
/* TODO: Typescript does not like AuthorActions.orderBy(options)
                orderBy: {
                    author: {
                        lastName: "asc",
                        firstName: "asc",
                    },
                },
*/
                select: {
                    author: true,
                    principal: true,
                },
                skip: AuthorActions.skip(options),
                take: AuthorActions.take(options),
                where: {
                    seriesId: seriesId,
                    author: AuthorActions.where(libraryId, options),
                },
            });
            const authors: AuthorPlus[] = [];
            for (const item of items) {
                if (item.principal !== undefined) {
                    item.author._principal = item.principal!;
                }
                authors.push(item.author as unknown as AuthorPlus);
            }
            return authors;
        } catch (error) {
            throw new ServerError(
                error as Error,
                "SeriesActions.authors"
            );
        }
    }

/**
 * Return the Series instance with the specified name, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param name                          Name of the requested Series
 * @param options                       Optional query options
 *
 * @throws NotFound                     If no such Series is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (libraryId: number, name: string, options?: SeriesFindOptions): Promise<SeriesPlus> => {
    try {
        logger.info({
            context: "SeriesActions.exact",
            libraryId: libraryId,
            name: name,
            options: options,
        });
        const result = await prisma.series.findUnique({
            include: include(options),
            where: {
                libraryId_name: {
                    libraryId,
                    name: name,
                },
            }
        });
        if (result) {
            return result as unknown as SeriesPlus;
        } else {
            throw new NotFound(
                `name: Missing Series '${name}'`,
                "SeriesActions.exact"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "SeriesActions.exact",
            );
        }
    }
}

/**
 * Return the Series instance with the specified seriesId, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the requested Series
 * @param options                       Optional query options
 *
 * @throws NotFound                     If no such Series is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, seriesId: number, options?: SeriesFindOptions): Promise<SeriesPlus> => {
    try {
        logger.info({
            context: "SeriesActions.find",
            libraryId: libraryId,
            seriesId: seriesId,
            options: options,
        });
        const result = await prisma.series.findUnique({
            include: include(options),
            where: {
                id: seriesId,
                libraryId: libraryId,
            }
        });
        if (result) {
            return result as unknown as SeriesPlus;
        } else {
            throw new NotFound(
                `id: Missing Series ${seriesId}`,
                "SeriesActions.find"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "SeriesActions.find",
            );
        }
    }
}

/**
 * Create and return a new Series instance, if it satisfies validation.
 *
 * @param libraryId                     ID of the owning Library
 * @param series                        Series to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (libraryId: number, series: Prisma.SeriesUncheckedCreateInput): Promise<SeriesPlus> => {
    logger.info({
        context: "SeriesActions.insert",
        libraryId: libraryId,
        series: series,
    });
    await LibraryActions.find(libraryId);
    if (!await uniqueName(libraryId, null, series.name)) {
        throw new NotUnique(
            `name: Series name '${series.name}' is already in use in this Library`,
            "SeriesActions.insert",
        );
    }
    const args: Prisma.SeriesUncheckedCreateInput = {
        ...series,
        id: undefined,                  // Just in case
        libraryId: libraryId,           // No cheating
    }
    try {
        const result = await prisma.series.create({
            data: args,
        });
        return result as unknown as SeriesPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "SeriesActions.insert",
        );
    }
}

/**
 * Remove and return the specified Series.
 *
 * @param libraryId                     ID of the owning Library
 * @param seriesId                      ID of the Series to be removed
 *
 * @throws NotFound                     If the specified Library or Series cannot be found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (libraryId: number, seriesId: number): Promise<SeriesPlus> => {
    logger.info({
        context: "SeriesActions.remove",
        libraryId: libraryId,
        seriesId: seriesId,
    });
    const series = await find(libraryId, seriesId);
    try {
        await prisma.series.delete({
            where: { id: seriesId },
        });
        return series;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "SeriesActions.remove",
        );
    }
}

/**
 * Connect the specified Story to this Series.
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the Series being connected to
 * @param storyId                       ID of the Story being connected
 * @param ordinal                       Ordinal order of this Story in this Series
 *
 * @throws NotFound                     If the specified Author or Story is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const storyConnect =
    async (libraryId: number, seriesId: number, storyId: number, ordinal?: number): Promise<SeriesPlus> =>
    {
        logger.info({
            context: "SeriesActions.storyConnect",
            libraryId: libraryId,
            seriesId: seriesId,
            storyId: storyId,
            ordinal: ordinal,
        });
        const series = await find(libraryId, seriesId);
        await StoryActions.find(libraryId, storyId);
        // TODO: await StoryActions.find(libraryId, storyId);
        try {
            await prisma.seriesStories.create({
                data: {
                    ordinal: ordinal,
                    seriesId: seriesId,
                    storyId: storyId,
                }
            });
            return series;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Series ID ${seriesId} and Story ID ${storyId} are already connected`,
                        "SeriesActions.storyConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "SeriesActions.storyConnect",
            );
        }
    }

/**
 * Disconnect the specified Story from this Series.
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the Series being disconnected from
 * @param storyId                       ID of the Story being disconnected
 *
 * @throws NotFound                     If the specified Author or Story is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const storyDisconnect =
    async (libraryId: number, seriesId: number, storyId: number): Promise<SeriesPlus> =>
    {
        logger.info({
            context: "SeriesActions.storyDisconnect",
            libraryId: libraryId,
            seriesId: seriesId,
            storyId: storyId,
        });
        const series = await find(libraryId, seriesId);
        // TODO: await StoryActions.find(libraryId, storyId);
        try {
            await prisma.seriesStories.delete({
                where: {
                    seriesId_storyId: {
                        seriesId: seriesId,
                        storyId: storyId,
                    }
                },
            });
            return series;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Series ID ${seriesId} and Story ID ${storyId} are not connected`,
                        "SeriesActions.storyDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "SeriesActions.storyDisconnect",
            );
        }

    }

/**
 * Return the Stories that are connected with this Series.
 *
 * @param libraryId                     ID of the Library being queried
 * @param seriesId                      ID of the Series for the requested Stories
 * @param options                       Optional match query parameters
 *
 * @throws NotFound                     If the specified Library or Series is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const stories =
    async (libraryId: number, seriesId: number, options?: StoryAllOptions): Promise<StoryPlus[]> => {
        logger.info({
            context: "SeriesActions.stories",
            libraryId: libraryId,
            seriesId: seriesId,
            options: options,
        });
        await find(libraryId, seriesId);
        try {
            const items = await prisma.seriesStories.findMany({
                orderBy: {
                    story: StoryActions.orderBy(options),
                },
                select: {
                    ordinal: true,
                    story: true,
                },
                skip: StoryActions.skip(options),
                take: StoryActions.take(options),
                where: {
                    seriesId: seriesId,
                    story: StoryActions.where(libraryId, options),
                },
            });
            const stories: StoryPlus[] = [];
            for (const item of items) {
                if (item.ordinal) {
                    item.story._ordinal = item.ordinal;
                }
                stories.push(item.story as unknown as StoryPlus);
            }
            return stories;
        } catch (error) {
            throw new ServerError(
                error as Error,
                "VolumeActions.stories"
            );
        }
    }

/**
 * Update and return the specified Series.
 *
 * @param libraryId                     ID of the owning Library
 * @param seriesId                      ID of the Series to be updated
 * @param series                        Updated data
 *
 * @throws NotFound                     If the specified Library or Series cannot be found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error is thrown
 */
export const update = async (libraryId: number, seriesId: number, series: Prisma.SeriesUncheckedUpdateInput): Promise<SeriesPlus> => {
    logger.info({
        context: "SeriesActions.update",
        libraryId: libraryId,
        seriesId: seriesId,
        series: series,
    });
    await find(libraryId, seriesId); // May throw NotFound
    if (series.name && (typeof series.name === "string") &&
        (!await uniqueName(libraryId, seriesId, series.name))) {
        throw new NotUnique(
            `name: Series name '${series.name}' is already in use in this Library`,
            "SeriesActions.update",
        );
    }
    try {
        const result = await prisma.series.update({
            data: {
                ...series,
                id: seriesId,            // No cheating
                libraryId: libraryId,   // No cheating`
            },
            where: { id: seriesId },
        });
        return result as unknown as SeriesPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "SeriesActions.update",
        );
    }
}

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * options, if any were specified.
 */
export const include = (options?: SeriesIncludeOptions): Prisma.SeriesInclude | undefined => {
    if (!options) {
        return undefined;
    }
    const include: Prisma.SeriesInclude = {};
    if (options.withAuthors) {
        include.authorsSeries = {
            include: {
                author: true,
//                series: true,
            }
        }
    }
    if (options.withLibrary) {
        include.library = true;
    }
    if (options.withStories) {
        include.seriesStories = {
            include: {
//                series: true,
                story: true,
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
export const orderBy = (options?: any): Prisma.SeriesOrderByWithRelationInput => {
    return {
        name: "asc"
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * options, if any were specified.
 */
export const select = (options?: any): Prisma.SeriesSelect | undefined => {
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
 * @param seriesId                      ID of the existing Series (if any)
 * @param name                          Proposed name
 */
export const uniqueName = async(libraryId: number, seriesId: number | null, name: string): Promise<boolean> => {
    try {
        const args: Prisma.SeriesFindManyArgs = {};
        if (seriesId) {
            args.where = {
                id: {
                    not: seriesId,
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
        const results = await prisma.series.findMany(args);
        return (results.length === 0);
    } catch (error) {
        throw new ServerError(
            error as Error,
            "SeriesActions.uniqueName",
        );
    }
}

/**
 * Calculate and return the "where" options from the specified query
 * options, if any were specified.
 */
export const where = (libraryId: number, options?: SeriesMatchOptions): Prisma.SeriesWhereInput | undefined => {
    let where: Prisma.SeriesWhereInput = {
        libraryId: libraryId,
    };
    if (!options) {
        return where;
    }
    if (typeof options.active !== undefined) {
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
