// types/models/Series.ts

/**
 * Extended (from Prisma) types for Series model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Prisma,
    Series,
    SeriesStories,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {PaginationOptions} from "@/types/types";

// Public Types --------------------------------------------------------------

/**
 * Type for options of an "all" function for this model.
 */
export type SeriesAllOptions = SeriesIncludeOptions & SeriesMatchOptions & PaginationOptions;

/**
 * Type for options of a "find" (or related single result)
 * function for this model.
 */
export type SeriesFindOptions = SeriesIncludeOptions;

/**
 * Type for options that select which child or parent models
 * should be included in the response.
 */
export type SeriesIncludeOptions = {
    // Include related Authors?
    withAuthors?: boolean;
    // Include parent Library?
    withLibrary?: boolean;
    // Include related Stories?
    withStories?: boolean;
}

/**
 * Type for options that select which Series objects
 * should be included in the response.
 */
export type SeriesMatchOptions = {
    // Whether to limit this response to Series with matching active values.
    active?: boolean;
    // The name (wildcard match) that should be returned.
    name?: string;
}

/**
 * A base Series with optional nested child arrays and/or parent.
 */
export type SeriesPlus = Series & Prisma.SeriesGetPayload<{
    include: {
        authorsSeries: true,
        library: true,
        seriesStories: true,
    }
} & { _model: string }>;

/**
 * Type for the Series-Stories join table.
 */
export type SeriesStoriesPlus = SeriesStories & Prisma.SeriesStoriesGetPayload<{
    include: {
        series: true,
        story: true,
    }
}>;
