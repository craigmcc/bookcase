//"use server"

// actions/VolumeActions.ts

/**
 * Server side actions for Volume model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "./AuthorActions";
import * as LibraryActions from "./LibraryActions";
import * as StoryActions from "./StoryActions";
import prisma from "../prisma";
import {
    VolumeAllOptions,
    VolumeFindOptions,
    VolumeIncludeOptions,
    VolumeMatchOptions,
    VolumePlus,
} from "@/types/models/Volume";
import {PaginationOptions} from "@/types/types";
import {validateVolumeLocation, validateVolumeType} from "@/util/ApplicationValidators";
import {BadRequest, NotFound, NotUnique, ServerError} from "@/util/HttpErrors";
import logger from "@/util/ServerLogger";

// Public Actions ------------------------------------------------------------

/**
 * Return all Volume instances that match the specified criteria.
 *
 * @param libraryId                     ID of the Library being queried
 * @param options                       Optional match query options
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (libraryId: number, options?: VolumeAllOptions): Promise<VolumePlus[]> => {
    logger.info({
        context: "VolumeActions.all",
        libraryId: libraryId,
        options: options,
    });
    const args: Prisma.VolumeFindManyArgs = {
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
        const results = await prisma.volume.findMany(args);
        return results as unknown as VolumePlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "VolumeActions.all",
        );
    }
}

/**
 * Connect the specified Author to this Volume.
 *
 * @param libraryId                     ID of the Library being queried
 * @param volumeId                      ID of the Volume being connected to
 * @param authorId                      ID of the Author being connected
 * @param principal                     Is this a principal Author of this Volume?
 *
 * @throws NotFound                     If the specified Volume or Author is not found
 * @throws NotUnique                    If this Author and Volume are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const authorConnect =
    async (libraryId: number, volumeId: number, authorId: number, principal?: boolean): Promise<VolumePlus> =>
    {
        logger.info({
            context: "VolumeActions.authorConnect",
            libraryId: libraryId,
            volumeId: volumeId,
            authorId: authorId,
            principal: principal,
        });
        const story = await find(libraryId, volumeId);
        await AuthorActions.find(libraryId, authorId);
        try {
            await prisma.authorsVolumes.create({
                data: {
                    authorId: authorId,
                    principal: principal,
                    volumeId: volumeId,
                }
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Author ID ${authorId} and Volume ID ${volumeId} are already connected`,
                        "VolumeAction.authorConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "VolumeActions.authorConnect()",
            );
        }
    }

/**
 * Disconnect the specified Author from this Volume.
 *
 * @param libraryId                     ID of the Library being queried
 * @param volumeId                      ID of the Volume being disconnected from
 * @param authorId                      ID of the Author being disconnected
 *
 * @throws NotFound                     If the specified Volume or Author is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const authorDisconnect =
    async (libraryId: number, volumeId: number, authorId: number): Promise<VolumePlus> =>
    {
        logger.info({
            context: "VolumeActions.authorDisconnect",
            libraryId: libraryId,
            volumeId: volumeId,
            authorId: authorId,
        });
        const story = await find(libraryId, volumeId);
        await AuthorActions.find(libraryId, authorId);
        try {
            await prisma.authorsVolumes.delete({
                where: {
                    authorId_volumeId: {
                        authorId: authorId,
                        volumeId: volumeId,
                    }
                },
            });
            return story;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Author ID ${authorId} and Volume ID ${volumeId} are not connected`,
                        "VolumeActions.authorDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "VolumeActions.authorDisconnect()",
            );
        }
    }

/**
 * Return the Volume instance with the specified name, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param name                          Name of the requested Volume
 * @param options                       Optional query options
 *
 * @throws NotFound                     If no such Volume is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (libraryId: number, name: string, options?: VolumeFindOptions): Promise<VolumePlus> => {
    try {
        logger.info({
            context: "VolumeActions.exact",
            libraryId: libraryId,
            name: name,
            options: options,
        });
        const result = await prisma.volume.findUnique({
            include: include(options),
            where: {
                libraryId_name: {
                    libraryId: libraryId,
                    name: name,
                }
            }
        });
        if (result) {
            return result as unknown as VolumePlus;
        } else {
            throw new NotFound(
                `name: Missing Volume '${name}'`,
                "VolumeActions.exact"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "VolumeActions.exact",
            );
        }
    }
}

/**
 * Return the Volume instance with the specified volumeId, or throw NotFound
 *
 * @param libraryId                     ID of the Library being queried
 * @param volumeId                      ID of the requested Volume
 * @param options                       Optional query options
 *
 * @throws NotFound                     If no such Volume is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, volumeId: number, options?: VolumeFindOptions): Promise<VolumePlus> => {
    try {
        logger.info({
            context: "VolumeActions.find",
            libraryId: libraryId,
            volumeId: volumeId,
            options: options,
        });
        const result = await prisma.volume.findUnique({
            include: include(options),
            where: {
                id: volumeId,
                libraryId: libraryId,
            }
        });
        if (result) {
            return result as unknown as VolumePlus;
        } else {
            throw new NotFound(
                `id: Missing Volume ${volumeId}`,
                "VolumeActions.find"
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "VolumeActions.find",
            );
        }
    }
}

/**
 * Create and return a new Volume instance, if it satisfies validation.
 *
 * @param libraryId                     ID of the owning Library
 * @param volume                        Volume to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (libraryId: number, volume: Prisma.VolumeUncheckedCreateInput): Promise<VolumePlus> => {
    logger.info({
        context: "VolumeActions.insert",
        libraryId: libraryId,
        volume: volume,
    });
    await LibraryActions.find(libraryId);
    if (!validateVolumeLocation(volume.location)) {
        throw new BadRequest(
            `location:  Invalid Volume location '${volume.location}'`,
            "VolumeActions.insert",
        );
    }
    if (!validateVolumeType(volume.type)) {
        throw new BadRequest(
            `type: Invalid Volume type '${volume.type}'`,
            "VolumeActions.insert",
        );
    }
    if (!await uniqueName(libraryId, null, volume.name)) {
        throw new NotUnique(
            `name: Volume name '${volume.name}' is already in use in this Library`,
            "VolumeActions.insert",
        );
    }
    const args: Prisma.VolumeUncheckedCreateInput = {
        ...volume,
        id: undefined,                  // Just in case
        libraryId: libraryId,           // No cheating
    }
    try {
        const result = await prisma.volume.create({
            data: args,
        });
        return result as unknown as VolumePlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "VolumeActions.insert",
        );
    }
}

/**
 * Remove and return the specified Volume.
 *
 * @param libraryId                     ID of the owning Library
 * @param volumeId                      ID of the Volume to be removed
 *
 * @throws NotFound                     If the specified Library or Volume cannot be found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (libraryId: number, volumeId: number): Promise<VolumePlus> => {
    try {
        logger.info({
            context: "VolumeActions.remove",
            libraryId: libraryId,
            volumeId: volumeId,
        });
        const story = await find(libraryId, volumeId);
        await prisma.volume.delete({
            where: { id: volumeId },
        });
        return story;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "VolumeActions.remove",
        );
    }
}

/**
 * Update and return the specified Volume.
 *
 * @param libraryId                     ID of the owning Library
 * @param volumeId                      ID of the Volume to be updated
 * @param volume                         Updated data
 *
 * @throws NotFound                     If the specified Library or Volume cannot be found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error is thrown
 */
export const update = async (libraryId: number, volumeId: number, volume: Prisma.VolumeUpdateInput): Promise<VolumePlus> => {
    logger.info({
        context: "VolumeActions.update",
        libraryId: libraryId,
        volumeId: volumeId,
        volume: volume,
    });
    await find(libraryId, volumeId); // May throw NotFound
    if (!validateVolumeLocation((typeof volume.location === "string") ? volume.location : null)) {
        throw new BadRequest(
            `location:  Invalid Volume location '${volume.location}'`,
            "VolumeActions.update",
        );
    }
    if (!validateVolumeType((typeof volume.type === "string") ? volume.type : null)) {
        throw new BadRequest(
            `type: Invalid Volume type '${volume.type}'`,
            "VolumeActions.update",
        );
    }
    if (volume.name && (typeof volume.name === "string") &&
        (!await uniqueName(libraryId, volumeId, volume.name))) {
        throw new NotUnique(
            `name: Volume name '${volume.name}' is already in use in this Library`,
            "VolumeActions.update",
        );
    }
    const data: Prisma.VolumeUncheckedUpdateInput = {
        ...volume,
        id: volumeId,                   // No cheating
        libraryId: libraryId,           // No cheating
    };
    try {
        const result = await prisma.volume.update({
            data: data,
            where: { id: volumeId },
        });
        return result as unknown as VolumePlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "VolumeActions.update",
        );
    }
}

/**
 * Connect the specified Story to this Volume.
 *
 * @param libraryId                     ID of the Library being queried
 * @param volumeId                      ID of the Volume being connected to
 * @param storyId                       ID of the Story being connected
 *
 * @throws NotFound                     If the specified Volume or Story is not found
 * @throws NotUnique                    If this Story and Volume are already connected
 * @throws ServerError                  If a low level error is thrown
 */
export const storyConnect =
    async (libraryId: number, volumeId: number, storyId: number): Promise<VolumePlus> =>
    {
        logger.info({
            context: "VolumeActions.storyConnect",
            libraryId: libraryId,
            volumeId: volumeId,
            storyId: storyId,
        });
        const volume = await find(libraryId, volumeId);
        await StoryActions.find(libraryId, storyId);
        try {
            await prisma.volumesStories.create({
                data: {
                    storyId: storyId,
                    volumeId: volumeId,
                }
            });
            return volume;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotUnique(
                        `connect: Story ID ${storyId} and Volume ID ${volumeId} are already connected`,
                        "VolumeAction.storyConnect"
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "VolumeActions.storyConnect()",
            );
        }
    }

/**
 * Disconnect the specified Story from this Volume.
 *
 * @param libraryId                     ID of the Library being queried
 * @param volumeId                      ID of the Volume being disconnected from
 * @param storyId                       ID of the Story being disconnected
 *
 * @throws NotFound                     If the specified Volume or Author is not found
 * @throws ServerError                  If a low level error is thrown
 */
export const storyDisconnect =
    async (libraryId: number, volumeId: number, storyId: number): Promise<VolumePlus> =>
    {
        logger.info({
            context: "VolumeActions.storyDisconnect",
            libraryId: libraryId,
            volumeId: volumeId,
            storyId: storyId,
        });
        const volume = await find(libraryId, volumeId);
        await StoryActions.find(libraryId, storyId);
        try {
            await prisma.volumesStories.delete({
                where: {
                    volumeId_storyId: {
                        storyId: storyId,
                        volumeId: volumeId,
                    }
                },
            });
            return volume;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new NotFound(
                        `disconnect: Story ID ${storyId} and Volume ID ${volumeId} are not connected`,
                        "VolumeActions.authorDisconnect",
                    );
                }
            }
            throw new ServerError(
                error as Error,
                "VolumeActions.authorDisconnect()",
            );
        }
    }

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * options, if they were specified.
 */
export const include = (options?: VolumeIncludeOptions): Prisma.VolumeInclude | undefined => {
    if (!options) {
        return undefined;
    }
    const include: Prisma.VolumeInclude = {};
    if (options.withAuthors) {
        include.authorsVolumes = {
            include: {
                author: true,
//                volume: true,
            }
        }
    }
    if (options.withLibrary) {
        include.library = true;
    }
    if (options.withStories) {
        include.volumesStories = {
            include: {
                story: true,
//                volume: true,
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
export const orderBy = (options?: any): Prisma.VolumeOrderByWithRelationInput => {
    return {
        name: "asc",
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * options, if any were specified.
 */
export const select = (options?: any): Prisma.VolumeSelect | undefined => {
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
 * @param volumeId                      ID of the existing Volume (if any)
 * @param name                          Proposed name
 */
export const uniqueName = async(libraryId: number, volumeId: number | null, name: string): Promise<boolean> => {
    try {
        const args: Prisma.VolumeFindManyArgs = {};
        if (volumeId) {
            args.where = {
                id: {
                    not: volumeId,
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
        const results = await prisma.volume.findMany(args);
        return (results.length === 0);
    } catch (error) {
        throw new ServerError(
            error as Error,
            "VolumeActions.uniqueName",
        );
    }
}

/**
 * Calculate and return the "where" options from the specified query
 * options, if any were specified.
 */
export const where = (libraryId: number, options?: VolumeMatchOptions): Prisma.VolumeWhereInput | undefined => {
    const where: Prisma.VolumeWhereInput = {
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

