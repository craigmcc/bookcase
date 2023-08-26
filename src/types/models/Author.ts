// types/models/Author.ts

/**
 * Extended (from Prisma) types for Author model objects.
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

import {PaginationOptions} from "@/types/types";

// Public Types --------------------------------------------------------------

/**
 * Type for options of an "all" function for this model.
 */
export type AuthorAllOptions = AuthorIncludeOptions & AuthorMatchOptions & PaginationOptions;

/**
 * Type for options of a "find" (or related single result)
 * function for this model.
 */
export type AuthorFindOptions = AuthorIncludeOptions;

/**
 * Type for options that select which child or parent models
 * should be included in the response.
 */
export type AuthorIncludeOptions = {
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
 * Type for options that select which Author objects
 * should be included in the response.
 */
export type AuthorMatchOptions = {
    // Whether to limit this response to Authors with matching active values.
    active?: boolean;
    // The name (wildcard match against firstName and lastName) that should
    // be returned.
    name?: string;
}

/**
 * A base Author with optional nested child arrays and/or parent.
 */
export type AuthorPlus = Author & Prisma.AuthorGetPayload<{
    include: {
        authorsSeries: true,
        authorsStories: true,
        authorsVolumes: true,
        library: true,
    }
}>;

/**
 * Type for the Authors-Series join table.
 */
export type AuthorsSeriesPlus = AuthorsSeries & Prisma.AuthorsSeriesGetPayload<{
    include: {
        author: true,
        series: true,
    }
}>;

/**
 * Type for the Authors-Stories join table.
 */
export type AuthorsStoriesPlus = AuthorsStories & Prisma.AuthorsStoriesGetPayload<{
    include: {
        author: true,
        story: true,
    }
}>;

/**
 * Type for the Authors-Volumes join table.
 */
export type AuthorsVolumesPlus = AuthorsVolumes & Prisma.AuthorsVolumesGetPayload<{
    include: {
        author: true,
        volume: true,
    }
}>;
