//"use server"

// actions/AuthorActions.ts

/**
 * Server side actions for Author model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Author,
    AuthorsSeries,
    AuthorsStories,
    AuthorsVolumes,
    Prisma,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "./LibraryActions";
import * as SeriesActions from "./SeriesActions";
import * as StoryActions from "./StoryActions";
import * as VolumeActions from "./VolumeActions";
import prisma from "../prisma";
import {PaginationOptions} from "@/types/types";
import {NotFound, NotUnique, ServerError} from "@/util/HttpErrors";

// Public Types --------------------------------------------------------------

/**
 * A base Author with optional nested parent and children.
 */
export type AuthorPlus = Author & Prisma.AuthorGetPayload<{
    include: {
        authorsSeries: true,
        authorsStories: true,
        library: true,
        authorsVolumes: true,
    }
}>;

/**
 * Explicit many-to-many relationship between Authors and Series.
 */
export type AuthorsSeriesPlus = AuthorsSeries & Prisma.AuthorsSeriesGetPayload<{
    include: {
        author: true,
        series: true,
    }
}>;

/**
 * Explicit many-to-many relationship between Authors and Stories.
 */
export type AuthorsStoriesPlus = AuthorsStories & Prisma.AuthorsStoriesGetPayload<{
    include: {
        author: true,
        story: true,
    }
}>;

/**
 * Explicit many-to-many relationship between Authors and Volumes.
 */
export type AuthorsVolumesPlus = AuthorsVolumes & Prisma.AuthorsVolumesGetPayload<{
    include: {
        author: true,
        volume: true,
    }
}>;

/**
 * The type for options of an "all" function for this model.
 */
export type AllOptions = IncludeOptions & MatchOptions & PaginationOptions;

/**
 * The type for options of a "find" (or related single result) function
 * for this model.
 */
export type FindOptions = IncludeOptions;

// Private Types -------------------------------------------------------------

/**
 * The type for options that select which related or parent models should be
 * included in a response.
 */
type IncludeOptions = {
    // Include parent Library?
    withLibrary?: boolean;
    // Include related Series?
    withSeries?: boolean;
    // Include related Stories?
    withStories?: boolean;
    // Include related Volumes?
    withVolumes?: boolean;
}

/**
 * The type for criteria that select which Author objects should be included
 * in the response.
 */
type MatchOptions = {
    // Whether to limit this response to Authors with matching active values.
    active?: boolean;
    // The name (wildcard match against firstName and lastName) of the
    // Authors that should be returned.
    name?: string;
}

// Public Actions ------------------------------------------------------------

/**
 * Return all Author instances that match the specified criteria.
 *
 * @param libraryId                     ID of the Library being queried
 * @param options                       Optional match query parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (libraryId: number, options?: AllOptions): Promise<AuthorPlus[]> => {
    const args: Prisma.AuthorFindManyArgs = {
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
        const results = await prisma.author.findMany(args);
        return results as AuthorPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AuthorActions.all",
        );
    }
}

/**
 * Return the Author instance with the specified name, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param firstName                     First name of the requested Author
 * @param lastName                      Last name of the requested Author
 * @param options                       Optional query parameters
 *
 * @throws NotFound                     If no such Author is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact =
    async (libraryId: number, firstName: string, lastName: string, options?: FindOptions): Promise<AuthorPlus> =>
    {
        try {
            const result = await prisma.author.findUnique({
                include: include(options),
                where: { libraryId_lastName_firstName: {
                        firstName: firstName,
                        lastName: lastName,
                        libraryId: libraryId,
                    }
                }
            });
            if (result) {
                return result as AuthorPlus;
            } else {
                throw new NotFound(
                    `name: Missing Author '${firstName} ${lastName}'`,
                    "AuthorActions.exact"
                );
            }
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            } else {
                throw new ServerError(
                    error as Error,
                    "AuthorActions.exact",
                );
            }
        }
    }

/**
 * Return the Author instance with the specified authorId, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param authorId                      ID of the requested Author
 * @param options                       Optional query parameters
 *
 * @throws NotFound                     If no such Author is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, authorId: number, options?: FindOptions): Promise<AuthorPlus> => {
    try {
        const result = await prisma.author.findUnique({
            include: include(options),
            where: {
                id: authorId,
                libraryId: libraryId,
            }
        });
        if (result) {
            return result as AuthorPlus;
        } else {
            throw new NotFound(
                `id: Missing Author ${authorId}`,
                "AuthorActions.find"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "AuthorActions.find",
            );
        }
    }
}

/**
 * Create and return a new Author instance, if it satisfies validation.
 *
 * @param libraryId                     ID of the owning Library
 * @param author                        Author to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (libraryId: number, author: Prisma.AuthorUncheckedCreateInput): Promise<AuthorPlus> => {
    await LibraryActions.find(libraryId);
    if (!await uniqueName(libraryId, null, author.firstName, author.lastName)) {
        throw new NotUnique(
            `name: Author name '${author.firstName} ${author.lastName}' is already in use in this Library`,
            "AuthorActions.insert",
        );
    }
    const args: Prisma.AuthorUncheckedCreateInput = {
        ...author,
        libraryId: libraryId,           // No cheating
    }
    try {
        const result = await prisma.author.create({
            data: args,
        });
        return result as AuthorPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AuthorActions.insert",
        );
    }
}


/**
 * Remove and return the specified Author.
 *
 * @param libraryId                     ID of the owning Library
 * @param authorId                      ID of the Author to be removed
 *
 * @throws NotFound                     If the specified Library or Author cannot be found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (libraryId: number, authorId: number): Promise<AuthorPlus> => {
    const author = await find(libraryId, authorId);
    try {
        await prisma.author.delete({
            where: { id: authorId },
        });
        return author;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AuthorActions.remove",
        );
    }
}

/**
 * Connect the specified Series to this Author.
 *
 * @param libraryId                     ID of the Library being queried
 * @param authorId                      ID of the Author being connected to
 * @param seriesId                      ID of the Series being connected
 * @param principal                     Is this Author a principal Author of this Series?
 *
 * @throws NotFound                     If the specified Author or Series is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const seriesConnect =
    async (libraryId: number, authorId: number, seriesId: number, principal?: boolean): Promise<AuthorPlus> =>
    {
        const author = await find(libraryId, authorId);
        await SeriesActions.find(libraryId, seriesId);
        try {
            await prisma.authorsSeries.create({
                data: {
                    authorId: authorId,
                    principal: (typeof principal !== undefined) ? principal : undefined,
                    seriesId: seriesId,
                }
            });
            return author;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Author ID ${authorId} and Series ID ${seriesId} are already connected`,
                        "AuthorActions.seriesConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "AuthorActions.seriesConnect()",
            );
        }
    }

/**
 * Disconnect the specified Series from this Author.
 *
 * @param libraryId                     ID of the Library being queried
 * @param authorId                      ID of the Author being disconnected from
 * @param seriesId                      ID of the Series being disconnected
 *
 * @throws NotFound                     If the specified Author or Story is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const seriesDisconnect =
    async (libraryId: number, authorId: number, seriesId: number): Promise<AuthorPlus> =>
    {
        const author = await find(libraryId, authorId);
        await SeriesActions.find(libraryId, seriesId);
        try {
            await prisma.authorsSeries.delete({
                where: {
                    authorId_seriesId: {
                        authorId: authorId,
                        seriesId: seriesId,
                    }
                },
            });
            return author;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Author ID ${authorId} and Series ID ${seriesId} are not connected`,
                        "AuthorActions.seriesDisconnect",
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
 * Connect the specified Story to this Author.
 *
 * @param libraryId                     ID of the Library being queried
 * @param authorId                      ID of the Author being connected to
 * @param storyId                       ID of the Story being connected
 * @param principal                     Is this a principal Author of this Story?
 *
 * @throws NotFound                     If the specified Author or Story is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const storyConnect =
    async (libraryId: number, authorId: number, storyId: number, principal?: boolean): Promise<AuthorPlus> =>
    {
        const author = await find(libraryId, authorId);
        await StoryActions.find(libraryId, storyId);
        try {
            await prisma.authorsStories.create({
                data: {
                    authorId: authorId,
                    principal: principal,
                    storyId: storyId,
                }
            });
            return author;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Author ID ${authorId} and Story ID ${storyId} are already connected`,
                        "AuthorActions.storyConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "AuthorActions.storyConnect",
            );
        }
    }

/**
 * Disconnect the specified Story from this Author.
 *
 * @param libraryId                     ID of the Library being queried
 * @param authorId                      ID of the Author being disconnected from
 * @param storyId                       ID of the Story being disconnected
 *
 * @throws NotFound                     If the specified Author or Story is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const storyDisconnect =
    async (libraryId: number, authorId: number, storyId: number): Promise<AuthorPlus> =>
    {
        const author = await find(libraryId, authorId);
        await StoryActions.find(libraryId, storyId);
        try {
            await prisma.authorsStories.delete({
                where: {
                    authorId_storyId: {
                        authorId: authorId,
                        storyId: storyId,
                    }
                },
            });
            return author;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Author ID ${authorId} and Story ID ${storyId} are not connected`,
                        "AuthorActions.storyDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "AuthorActions.storyDisconnect",
            );
        }

    }

/**
 * Update and return the specified Author.
 *
 * @param libraryId                     ID of the owning Library
 * @param authorId                      ID of the Author to be updated
 * @param author                        Updated data
 *
 * @throws NotFound                     If the specified Library or Author cannot be found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error is thrown
 */
export const update = async (libraryId: number, authorId: number, author: Prisma.AuthorUncheckedUpdateInput): Promise<AuthorPlus> => {
    await find(libraryId, authorId); // May throw NotFound
    if (author.firstName && (typeof author.firstName === "string") &&
        author.lastName && (typeof author.lastName === "string") &&
        (!await uniqueName(libraryId, authorId, author.firstName, author.lastName))) {
        throw new NotUnique(
            `name: Author name '${author.firstName} ${author.lastName}' is already in use in this Library`,
            "AuthorActions.update",
        );
    }
    try {
        const result = await prisma.author.update({
            data: {
                ...author,
                id: authorId,           // No cheating
                libraryId: libraryId,   // No cheating`
            },
            where: { id: authorId },
        });
        return result as AuthorPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AuthorActions.update",
        );
    }
}

/**
 * Connect the specified Volume to this Author.
 *
 * @param libraryId                     ID of the Library being queried
 * @param authorId                      ID of the Author being connected to
 * @param volumeId                      ID of the Volume being connected
 * @param principal                     Is this a principal Author of this Story?
 *
 * @throws NotFound                     If the specified Author or Story is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const volumeConnect =
    async (libraryId: number, authorId: number, volumeId: number, principal?: boolean): Promise<AuthorPlus> =>
    {
        const author = await find(libraryId, authorId);
        await VolumeActions.find(libraryId, volumeId);
        try {
            await prisma.authorsVolumes.create({
                data: {
                    authorId: authorId,
                    principal: principal,
                    volumeId: volumeId,
                }
            });
            return author;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Author ID ${authorId} and Volume ID ${volumeId} are already connected`,
                        "AuthorActions.volumeConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "AuthorActions.volumeConnect()",
            );
        }
    }

/**
 * Disconnect the specified Volume from this Author.
 *
 * @param libraryId                     ID of the Library being queried
 * @param authorId                      ID of the Author being disconnected from
 * @param volumeId                      ID of the Volume being disconnected
 *
 * @throws NotFound                     If the specified Author or Volume is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const volumeDisconnect =
    async (libraryId: number, authorId: number, volumeId: number): Promise<AuthorPlus> =>
    {
        const author = await find(libraryId, authorId);
        await VolumeActions.find(libraryId, volumeId);
        try {
            await prisma.authorsVolumes.delete({
                where: {
                    authorId_volumeId: {
                        authorId: authorId,
                        volumeId: volumeId,
                    }
                },
            });
            return author;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Author ID ${authorId} and Volume ID ${volumeId} are not connected`,
                        "AuthorActions.storyDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "AuthorActions.volumeDisconnect()",
            );
        }

    }

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * options, if any were specified.
 */
export const include = (options?: IncludeOptions): Prisma.AuthorInclude | undefined => {
    if (!options) {
        return undefined;
    }
    const include: Prisma.AuthorInclude = {};
    if (options.withLibrary) {
        include.library = true;
    }
    if (options.withSeries) {
        include.authorsSeries = {
            include: {
//                author: true,
                series: true,
            }
        }
    }
    if (options.withStories) {
        include.authorsStories = {
            include: {
//                author: true,
                story: true,
            }
        }
    }
    if (options.withVolumes) {
        include.authorsVolumes = {
            include: {
//                author: true,
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
export const orderBy = (options?: any): Prisma.AuthorOrderByWithRelationInput[] => {
    return [
        { lastName: "asc" },
        { firstName: "asc"},
    ];
}

/**
 * Calculate and return the "select" options from the specified query
 * options, if any were specified.
 */
export const select = (options?: any): Prisma.AuthorSelect | undefined => {
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
 * @param authorId                      ID of the existing Author (if any)
 * @param firstName                     Proposed first name
 * @param lastName                      Proposed last name
 */
export const uniqueName = async(libraryId: number, authorId: number | null, firstName: string, lastName: string): Promise<boolean> => {
    try {
        const args: Prisma.AuthorFindManyArgs = {};
        if (authorId) {
            args.where = {
                id: {
                    not: authorId,
                },
                firstName: firstName,
                lastName: lastName,
                libraryId: libraryId,
            }
        } else {
            args.where = {
                firstName: firstName,
                lastName: lastName,
                libraryId: libraryId,
            }
        }
        const results = await prisma.author.findMany(args);
        return (results.length === 0);
    } catch (error) {
        throw new ServerError(
            error as Error,
            "AuthorActions.uniqueName",
        );
    }
}

/**
 * Calculate and return the "where" options from the specified query
 * options, if any were specified.
 */
export const where = (libraryId: number, options?: any): Prisma.AuthorWhereInput | undefined => {
    let where: Prisma.AuthorWhereInput = {
        libraryId: libraryId,
    };
    if (!options) {
        return where;
    }
    // Special case for name matching
    if (options?.name) {
        const names = options.name.trim().split(" ");
        const firstMatch = names[0];
        const lastMatch = (names.length > 1) ? names[1] : names[0];
        where = {
            OR: [
                {
                    firstName: {
                        contains: firstMatch,
                        mode: "insensitive",
                    },
                },
                {
                    lastName: {
                        contains: lastMatch,
                        mode: "insensitive",
                    },
                },
            ],
            AND: {
                active: (options.active !== undefined) ? options.active : undefined,
                libraryId: libraryId,
            },
        }
    } else if (options?.active !== undefined) {
        where = {
            active: options.active,
            libraryId: libraryId,
        }
    }
    return where;
}
