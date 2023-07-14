//"use server"

// actions/UserActions.ts

/**
 * Server side actions for User model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Prisma,
    User,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import prisma from "@/prisma";
import {hashPassword} from "@/oauth/OAuthUtils";
import {PaginationOptions} from "@/types/types";
import {BadRequest, NotFound, NotUnique, ServerError} from "@/util/HttpErrors";

// Public Types --------------------------------------------------------------

/**
 * A base User with optional nested child object arrays.
 */
export type UserPlus = User & Prisma.UserGetPayload<{
    include: {
        accessTokens: true,
        refreshTokens: true,
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
 * The type for options that select which child models should be
 * included in a response.
 */
type IncludeOptions = {
    // Include access tokens?
    withAccessTokens?: boolean;
    // Include refresh tokens?
    withRefreshTokens?: boolean;
}

/**
 * The type for criteria that select which User objects should be included
 * in the response.
 */
type MatchOptions = {
    // Whether to limit this response to Users with matching active values.
    active?: boolean;
    // The username (wildcard match) of Users that should be returned.
    username?: string;
}

// Public Actions ------------------------------------------------------------

/**
 * Return all User instances that match the specified criteria.
 *
 * @param options                       Optional match query parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (options?: AllOptions): Promise<UserPlus[]> => {
    const args: Prisma.UserFindManyArgs = {
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
        const results = await prisma.user.findMany(args);
        for (const result of results) {
            result.password = "";
        }
        return results as UserPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "UserActions.all",
        )
    }
}

/**
 * Return the User instance with the specified username, or throw NotFound.
 *
 * @param username                      Username of the requested User
 * @param options                       Optional include query parameters
 *
 * @throws NotFound                     If no such User is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (username: string, options?: FindOptions): Promise<UserPlus> => {
    try {
        const result = await prisma.user.findUnique({
            include: include(options),
            where: {
                username: username,
            }
        });
        if (result) {
            result.password = "";
            return result as UserPlus;
        } else {
            throw new NotFound(
                `username: Missing User '${username}'`,
                "UserActions.exact",
            )
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "UserActions.exact",
            )
        }
    }
}

/**
 * Return the User instance with the specified userId, or throw NotFound.
 *
 * @param userId                        ID of the requested User
 * @param options                       Optional include query parameters
 *
 * @throws NotFound                     If no such User is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (userId: number, options?: FindOptions): Promise<UserPlus> => {
    try {
        const result = await prisma.user.findUnique({
            include: include(options),
            where: {
                id: userId,
            }
        });
        if (result) {
            result.password = "";
            return result as UserPlus;
        } else {
            throw new NotFound(
                `id: Missing User ${userId}`,
                "UserActions.find"
            )
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "UserActions.find",
            )
        }
    }
}

/**
 * Create and return a new User instance, if it satisfies validation.
 *
 * @param user                          User to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (user: Prisma.UserCreateInput): Promise<UserPlus> => {
    if (!await uniqueUsername(null, user.username)) {
        throw new NotUnique(
            `username: User username '${user.username}' is already in use`,
            "UserActions.insert",
        )
    }
    const args: Prisma.UserCreateArgs = {
        data: {
            ...user,
            password: await hashPassword(user.password),
        },
    }
    try {
        const result = await prisma.user.create(args);
        result.password = "";
        return result as UserPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "UserActions.insert"
        );
    }
}

/**
 * Remove and return the specified User.
 *
 * @param userId                        ID of the User to be removed
 *
 * @throws NotFound                     If no such User is found
 * @throws ServerError                  If a low level error is thrown
 */
export const remove = async (userId: number): Promise<UserPlus> => {
    await find(userId); // May throw NotFound
    try {
        const result = await prisma.user.delete({
            where: {
                id: userId,
            }
        });
        result.password = "";
        return result as UserPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "UserActions.remove",
        );
    }
}

/**
 * Update and return the specified User.
 *
 * @param userId                        ID of the User to be updated
 * @param user                          Updated data
 *
 * @throws BadRequest                   If validation fails
 * @throws NotFound                     If no such User is found
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error is thrown
 */
export const update = async (userId: number, user: Prisma.UserUpdateInput): Promise<UserPlus> => {
    const original = await find(userId); // May throw NotFound
    if (user.username && (typeof user.username === "string") && (!await uniqueUsername(userId, user.username))) {
        throw new NotUnique(
            `username: User username '${user.username}' is already in use`,
            "UserActions.update",
        )
    }
    try {
        const result = await prisma.user.update({
            data: {
                ...user,
                id: userId,      // No cheating
                password: user.password && (typeof user.password === "string") && (user.password.length > 0)
                    ? await hashPassword(user.password)
                    : undefined,
            },
            where: {
                id: userId,
            }
        });
        result.password = "";
        return result as UserPlus;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "UserActions.update"
        );
    }
}

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * options, if any were specified.
 */
export const include = (options?: IncludeOptions): Prisma.UserInclude | undefined => {
    if (!options) {
        return undefined;
    }
    const include: Prisma.UserInclude = {};
    if (options.withAccessTokens) {
        include.accessTokens = true;
    }
    if (options.withRefreshTokens) {
        include.refreshTokens = true;
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
export const orderBy = (options?: any): Prisma.UserOrderByWithRelationInput => {
    return {
        username: "asc",
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * options, if any were specified.
 */
export const select = (options?: any): Prisma.UserSelect | undefined => {
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
 * Return true if the proposed username is unique.
 *
 * @param userId                        ID of the existing User (if any)
 * @param username                      Proposed User username
 */
export const uniqueUsername = async (userId: number | null, username: string): Promise<boolean> => {
    try {
        const user = await exact(username);
        return (user.id === userId); // Corresponds to this User
    } catch (error) {
        if (error instanceof NotFound) {
            return true; // Definitely unique
        } else {
            throw new ServerError(
                error as Error,
                "UserActions.uniqueUsername",
            );
        }
    }
}

/**
 * Calculate and return the "where" options from the specified query
 * options, if any were specified.
 */
export const where = (options?: any): Prisma.UserWhereInput | undefined => {
    if (!options) {
        return undefined;
    }
    const where: Prisma.UserWhereInput = {};
    if (options.active !== undefined) {
        where.active = options.active;
    }
    if (options.username) {
        where.username = {
            contains: options.username,
            mode: "insensitive",
        }
    }
    if (Object.keys(where).length > 0) {
        return where;
    } else {
        return undefined;
    }
}
