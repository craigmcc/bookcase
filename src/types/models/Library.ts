// types/models/Library.ts

/**
 * Extended (from Prisma) types for Library model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Library, Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {PaginationOptions} from "@/types/types";

// Public Types --------------------------------------------------------------

/**
 * The type for options of an "all" function for this model.
 */
export type LibraryAllOptions = LibraryIncludeOptions & LibraryMatchOptions & PaginationOptions;

/**
 * The type for options of a "find" (or related single result) function
 * for this model.
 */
export type LibraryFindOptions = LibraryIncludeOptions;

/**
 * The type for options that select which child or parent models should be
 * included in a response.
 */
export type LibraryIncludeOptions = {
    // Include child Authors?
    withAuthors?: boolean;
    // Include child Series?
    withSeries?: boolean;
    // Include child Stories?
    withStories?: boolean;
    // Include child Volumes?
    withVolumes?: boolean;
}


/**
 * The type for criteria that select which Library objects should be included
 * in the response.
 */
export type LibraryMatchOptions = {
    // Whether to limit this response to Libraries with matching active values.
    active?: boolean;
    // The name (wildcard match) of the Libraries that should be returned.
    name?: string;
    // The scope (unique per Library) for authorizations for this Library.
    scope?: string;
}


/**
 * A base Library with optional nested child object arrays.
 */
export type LibraryPlus = Library & Prisma.LibraryGetPayload<{
    include: {
        authors: true,
        series: true,
        stories: true,
        volumes: true,
    }
} & { _model: string }>;

