//"use server"

// actions/LibraryActions.ts

/**
 * Server side actions for Library model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import prisma from "../prisma";
import {
    LibraryAllOptions,
    LibraryFindOptions,
    LibraryIncludeOptions,
    LibraryMatchOptions,
    LibraryPlus,
} from "@/types/models/Library";
import {PaginationOptions} from "@/types/types";
import {validateLibraryScope} from "@/util/ApplicationValidators";
import {BadRequest, NotFound, NotUnique, ServerError} from "@/util/HttpErrors";
import logger from "@/util/ServerLogger";

// Public Actions ------------------------------------------------------------

/**
 * Return all Library instances that match the specified criteria.
 *
 * @param options                       Optional match/include/pagination options
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (options?: LibraryAllOptions): Promise<LibraryPlus[]> => {
    logger.info({
        context: "LibraryActions.all",
        options: options,
    });
    const args: Prisma.LibraryFindManyArgs = {
        // cursor???
        // distinct???
        include: include(options),
        orderBy: orderBy(options),
        select: select(options),
        skip: skip(options),
        take: take(options),
        where: where(options),
    }
    try {
        const results =
            await prisma.library.findMany(args);
        return results as unknown as LibraryPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "LibraryActions.all",
        )
    }
}

// TODO: LibraryActions.authors()

/**
 * Return the Library instance with the specified name, or throw NotFound.
 *
 * @param name                          Name of the requested Library
 * @param options                       Optional include query parameters
 *
 * @throws NotFound                     If no such Library is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (name: string, options?: LibraryFindOptions): Promise<LibraryPlus> => {
    try {
        logger.info({
            context: "LibraryActions.exact",
            name: name,
            options: options,
        });
        const result = await prisma.library.findUnique({
            include: include(options),
            where: {
                name: name,
            }
        });
        if (result) {
            return result as unknown as LibraryPlus;
        } else {
            throw new NotFound(
                `name: Missing Library '${name}'`,
                "LibraryActions.exact",
            )
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "LibraryActions.exact",
            )
        }
    }
}

/**
 * Return the Library instance with the specified libraryId, or throw NotFound.
 *
 * @param libraryId                     ID of the requested Library
 * @param options                       Optional include query parameters
 *
 * @throws NotFound                     If no such Library is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, options?: LibraryFindOptions): Promise<LibraryPlus> => {
    try {
        logger.info({
            context: "LibraryActions.find",
            libraryId: libraryId,
            options: options,
        });
        const result =
            await prisma.library.findUnique({
                include: include(options),
                where: {
                    id: libraryId,
                }
            });
        if (result) {
/*
            logger.info({
                context: "LibraryActions.find.found",
                library: result,
                _model: result._model,
            });
*/
            return result as unknown as LibraryPlus;
        } else {
            throw new NotFound(
                `id: Missing Library ${libraryId}`,
                "LibraryActions.find"
            )
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "LibraryActions.find",
            )
        }
    }
}

/**
 * Create and return a new Library instance, if it satisfies validation.
 *
 * @param library                       Library to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (library: Prisma.LibraryCreateInput): Promise<LibraryPlus> => {
    logger.info({
        context: "LibraryActions.insert",
        library: library,
    });
    if (!validateLibraryScope(library.scope)) {
        throw new BadRequest(
            `scope: Scope '${library.scope}' must not contain spaces`,
            "LibraryActions.insert",
        );
    }
    if (!await uniqueName(null, library.name)) {
        throw new NotUnique(
            `name: Library name '${library.name}' is already in use`,
            "LibraryActions.insert",
        )
    }
    if (!await uniqueScope(null, library.scope)) {
        throw new NotUnique(
            `scope: Library scope '${library.scope}' is already in use`,
            "LibraryActions.insert",
        )
    }
    try {
        // @ts-ignore
        delete library.id;
        const result =
            await prisma.library.create({ data: library });
        return result as unknown as LibraryPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "LibraryActions.insert"
        );
    }
}

/**
 * Remove and return the specified Library.
 *
 * @param libraryId                     ID of the Library to be removed
 *
 * @throws NotFound                     If no such Library is found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (libraryId: number): Promise<LibraryPlus> => {
    logger.info({
        context: "LibraryActions.remove",
        libraryId: libraryId,
    });
    await find(libraryId); // May throw NotFound
    try {
        const result = await prisma.library.delete({
            where: {
                id: libraryId,
            }
        });
        return result as unknown as LibraryPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "LibraryActions.remove",
        );
    }
}

// TODO: LibraryActions.series()

// TODO: LibraryActions.stories()

/**
 * Update and return the specified Library.
 *
 * @param libraryId                     ID of the Library to be updated
 * @param library                       Updated data
 *
 * @throws BadRequest                   If validation fails
 * @throws NotFound                     If no such Library is found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error is thrown
 */
export const update = async (libraryId: number, library: Prisma.LibraryUpdateInput): Promise<LibraryPlus> => {
    logger.info({
        context: "LibraryActions.update",
        libraryId: libraryId,
        library: library,
    });
    if (library.scope && (typeof library.scope === "string") && !validateLibraryScope(library.scope)) {
        throw new BadRequest(
            `scope: Scope '${library.scope}' must not contain spaces`,
            "LibraryActions.update",
        );
    }
    if (library.name && (typeof library.name === "string") && (!await uniqueName(libraryId, library.name))) {
        throw new NotUnique(
            `name: Library name '${library.name}' is already in use`,
            "LibraryActions.update",
        )
    }
    if (library.scope && (typeof library.scope === "string") && (!await uniqueScope(libraryId, library.scope))) {
        throw new NotUnique(
            `scope: Library scope '${library.scope}' is already in use`,
            "LibraryActions.update",
        )
    }
    try {
        const result = await prisma.library.update({
            data: {
                ...library,
                id: libraryId,      // No cheating
            },
            where: {
                id: libraryId,
            }
        });
        return result as unknown as LibraryPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "LibraryActions.update"
        );
    }
}

// TODO: LibraryActions.volumes()

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * options, if any were specified.
 */
export const include = (options?: LibraryIncludeOptions): Prisma.LibraryInclude | undefined => {
    if (!options) {
        return undefined;
    }
    const include: Prisma.LibraryInclude = {};
    if (options.withAuthors) {
        include.authors = true;
    }
    if (options.withSeries) {
        include.series = true;
    }
    if (options.withStories) {
        include.stories = true;
    }
    if (options.withVolumes) {
        include.volumes = true;
    }
    if (Object.keys(include).length > 0) {
        return include;
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "orderBy" options from the specified query
 * parameters, if any were specified.
 */
export const orderBy = (query?: any): Prisma.LibraryOrderByWithRelationInput => {
    return {
        name: "asc",
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * parameters, if any were specified.
 */
export const select = (query?: any): Prisma.LibrarySelect | undefined => {
    return undefined; // TODO - for future use
}

/**
 * Calculate and return the "skip" options (pre-Prisma called "offset")
 * from the specified query options, if any were specified.
 */
export const skip = (options?: PaginationOptions): number | undefined => {
    if (options?.offset) {
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
    if (options?.limit) {
        return Number(options.limit);
    } else {
        return undefined;
    }
}

/**
 * Return true if the proposed name is unique.
 *
 * @param libraryId                     ID of the existing Library (if any)
 * @param name                          Proposed Library name
 */
export const uniqueName = async (libraryId: number | null, name: string): Promise<boolean> => {
    try {
        const library = await exact(name);
        return (library.id === libraryId);  // Corresponds to this Library
    } catch (error) {
        if (error instanceof NotFound) {
            return true; // Definitely unique
        } else {
            throw new ServerError(
                error as Error,
                "LibraryActions.uniqueName"
            );
        }
    }
}

/**
 * Return true if the proposed scope is unique.
 *
 * @param libraryId                     ID of the existing Library (if any)
 * @param scope                         Proposed Library scope
 */
export const uniqueScope = async (libraryId: number | null, scope: string): Promise<boolean> => {
    try {
        const library =
            await prisma.library.findUnique({
                where: {
                    scope: scope,
                }
            });
        if (library) {
            return (library.id === libraryId);  // Corresponds to this Library
        } else {
            return true; // Definitely unique
        }
    } catch (error) {
        if (error instanceof NotFound) {
            return true; // Definitely unique
        } else {
            throw new ServerError(
                error as Error,
                "LibraryActions.uniqueScope"
            );
        }
    }
}

/**
 * Calculate and return the "where" options from the specified query
 * parameters, if any were specified.
 *
 * @param options                       MatchOptions relevant for this model
 */
export const where = (options?: LibraryMatchOptions): Prisma.LibraryWhereInput | undefined => {
    if (!options) {
        return undefined;
    }
    const where: Prisma.LibraryWhereInput = {};
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
    if (options.scope) {
        // Exact match
        where.scope = {
            equals: options.scope,
        }
    }
    if (Object.keys(where).length > 0) {
        return where;
    } else {
        return undefined;
    }
}
