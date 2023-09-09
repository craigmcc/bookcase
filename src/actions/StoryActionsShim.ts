"use server"

// actions/StoryActionsShim.ts

/**
 * Attempt to work around Jest's rejection of modules that have "use server"
 * at the top, by providing a shim that just delegates to those real functions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as StoryActions from "./StoryActions";
import {AuthorAllOptions, AuthorPlus} from "@/types/models/Author";
import {SeriesAllOptions, SeriesPlus} from "@/types/models/Series";
import {
    StoryAllOptions,
    StoryFindOptions,
    StoryPlus,
} from "@/types/models/Story";
import {VolumeAllOptions, VolumePlus} from "@/types/models/Volume";

// Public Functions ----------------------------------------------------------

export const all = async (libraryId: number, options?: StoryAllOptions): Promise<StoryPlus[]> => {
    return await StoryActions.all(libraryId, options);
}

export const authorConnect =
    async (libraryId: number, storyId: number, authorId: number, principal?: boolean): Promise<StoryPlus> => {
        return StoryActions.authorConnect(libraryId, storyId, authorId, principal);
    }

export const authorDisconnect =
    async (libraryId: number, storyId: number, authorId: number): Promise<StoryPlus> => {
        return await StoryActions.authorDisconnect(libraryId, storyId, authorId);
    }

export const authors =
    async (libraryId: number, storyId: number, options?: AuthorAllOptions): Promise<AuthorPlus[]> => {
        return await StoryActions.authors(libraryId, storyId, options);
    }

export const exact = async (libraryId: number, name: string, options?: StoryFindOptions): Promise<StoryPlus> => {
    return await StoryActions.exact(libraryId, name, options);
}

export const find = async (libraryId: number, storyId: number, options?: StoryFindOptions): Promise<StoryPlus> => {
    return await StoryActions.find(libraryId, storyId, options);
}

export const insert = async(libraryId: number, story: Prisma.StoryUncheckedCreateInput): Promise<StoryPlus> => {
    return await StoryActions.insert(libraryId, story);
}

export const remove = async (libraryId: number, storyId: number): Promise<StoryPlus> => {
    return await StoryActions.remove(libraryId, storyId);
}

export const seriesConnect =
    async (libraryId: number, storyId: number, seriesId: number, ordinal?: number): Promise<StoryPlus> => {
        return await StoryActions.seriesConnect(libraryId, storyId, seriesId, ordinal);
    }

export const seriesDisconnect =
    async (libraryId: number, storyId: number, seriesId: number): Promise<StoryPlus> => {
        return await StoryActions.seriesDisconnect(libraryId, storyId, seriesId);
    }

export const series =
    async (libraryId: number, storyId: number, options?: SeriesAllOptions): Promise<SeriesPlus[]> => {
        return await StoryActions.series(libraryId, storyId, options);
    }

export const update = async (libraryId: number, storyId: number, story: Prisma.StoryUpdateInput): Promise<StoryPlus> => {
    return await StoryActions.update(libraryId, storyId, story);
}

export const volumeConnect = async (libraryId: number, storyId: number, volumeId: number): Promise<StoryPlus> =>{
    return await StoryActions.volumeConnect(libraryId, storyId, volumeId);
}

export const volumeDisconnect = async (libraryId: number, storyId: number, volumeId: number): Promise<StoryPlus> => {
    return await StoryActions.volumeDisconnect(libraryId, storyId, volumeId);
}

export const volumes =
    async (libraryId: number, storyId: number, options?: VolumeAllOptions): Promise<VolumePlus[]> => {
        return await StoryActions.volumes(libraryId, storyId, options);
    }


