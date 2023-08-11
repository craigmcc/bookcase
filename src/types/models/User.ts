// types/models/User.ts

/**
 * Extended (from Prisma) types for User model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, User} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {PaginationOptions} from "@/types/types";

// Public Types --------------------------------------------------------------

/**
 * The type for options of an "all" function for this model.
 */
export type UserAllOptions = UserIncludeOptions & UserMatchOptions & PaginationOptions;

/**
 * The type for options of a "find" (or related single result) function
 * for this model.
 */
export type UserFindOptions = UserIncludeOptions;

/**
 * The type for options that select which child or parent models should be
 * included in a response.
 */
export type UserIncludeOptions = {
    // Include child AccessTokens?
    withAccessTokens?: boolean;
    // Include child RefreshTokens?
    withRefreshTokens?: boolean;
}


/**
 * The type for criteria that select which User objects should be included
 * in the response.
 */
export type UserMatchOptions = {
    // Whether to limit this response to Users with matching active values.
    active?: boolean;
    // The username (wildcard match) of the Users that should be returned.
    username?: string;
}


/**
 * A base User with optional nested child object arrays.
 */
export type UserPlus = User & Prisma.UserGetPayload<{
    include: {
        accessTokens: true,
        refreshTokens: true,
    }
}>;

