// types/models/Volume.ts

/**
 * Extended (from Prisma) types for Volume model objects.
 *
 * @packageDoumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, Volume, VolumesStories} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {PaginationOptions} from "@/types/types";

// Public Types --------------------------------------------------------------

/**
 * Type for options of an "all" function for this model.
 */
export type VolumeAllOptions = VolumeIncludeOptions & VolumeMatchOptions & PaginationOptions;

/**
 * Type for options of a "find" (or related single result) function
 * for this model.
 */
export type VolumeFindOptions = VolumeIncludeOptions;

/**
 * Type for options that select which child or parent models
 * should be included in a response.
 */
export type VolumeIncludeOptions = {
    // Include related Authors?
    withAuthors?: boolean;
    // Include parent Library?
    withLibrary?: boolean;
    // Include related Stories?
    withStories?: boolean;
}

/**
 * Type for options that select which Volume objects
 * should be included in the response.
 */
export type VolumeMatchOptions = {
    // Whether to limit this response to Volumes with matching active values.
    active?: boolean;
    // The name (wildcard match) of Volumes that should be returned
    name?: string;
}

/**
 * A base Volume with optional nested child arrays and/or parent.
 */
export type VolumePlus = Volume & Prisma.VolumeGetPayload<{
    include: {
        authorsVolumes: true,
        library: true,
        volumesStories: true,
    }
}>;

/**
 * Type for the Volumes-Stories join table.
 */
export type VolumesStoriesPlus = VolumesStories & Prisma.VolumesStoriesGetPayload<{
    include: {
        story: true,
        volume: true,
    }
}>
