// types/models/Story.ts

/**
 * Extended (from Prisma) types for Story model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Prisma,
    Story,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {PaginationOptions} from "@/types/types";

// Public Types --------------------------------------------------------------

/**
 * Type for options of an "all" function for this model.
 */
export type StoryAllOptions = StoryIncludeOptions & StoryMatchOptions & PaginationOptions;

/**
 * Type for options of a "find" (or related single result)
 * function for this model.
 */
export type StoryFindOptions = StoryIncludeOptions;

/**
 * Type for options that select which child or parent models
 * should be included in the response.
 */
export type StoryIncludeOptions = {
    // Include related Authors?
    withAuthors?: boolean;
    // Include parent Library?
    withLibrary?: boolean;
    // Include related Series?
    withSeries?: boolean;
    // Include related Volumes?
    withVolumes?: boolean;
}

/**
 * Type for options that select which Story objects
 * should be included in the response.
 */
export type StoryMatchOptions = {
    // Whether to limit this response to Story with matching active values.
    active?: boolean;
    // The name (wildcard match) that should be returned.
    name?: string;
}

/**
 * A base Story with optional nested child arrays and/or parent.
 */
export type StoryPlus = Story & Prisma.StoryGetPayload<{
    include: {
        authorsStories: true,
        library: true,
        seriesStories: true,
        volumesStories: true,
    }
}>;
