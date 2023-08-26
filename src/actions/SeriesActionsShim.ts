"use server"

// actions/SeriesActionsShim.ts

/**
 * Attempt to work around Jest's rejection of modules that have "use server"
 * at the top, by providing a shim that just delegates to those real functions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as SeriesActions from "./SeriesActions";
import {
    SeriesAllOptions,
    SeriesFindOptions,
    SeriesPlus,
} from "@/types/models/Series";

// Public Functions ----------------------------------------------------------

export const all = async (libraryId: number, options?: SeriesAllOptions): Promise<SeriesPlus[]> => {
    return await SeriesActions.all(libraryId, options);
}

export const authorConnect =
    async (libraryId: number, storyId: number, authorId: number, principal?: boolean): Promise<SeriesPlus> => {
        return SeriesActions.authorConnect(libraryId, storyId, authorId, principal);
    }

export const authorDisconnect =
    async (libraryId: number, storyId: number, authorId: number): Promise<SeriesPlus> => {
        return await SeriesActions.authorDisconnect(libraryId, storyId, authorId);
    }

export const exact = async (libraryId: number, name: string, options?: SeriesFindOptions): Promise<SeriesPlus> => {
    return await SeriesActions.exact(libraryId, name, options);
}

export const find = async (libraryId: number, storyId: number, options?: SeriesFindOptions): Promise<SeriesPlus> => {
    return await SeriesActions.find(libraryId, storyId, options);
}

export const insert = async(libraryId: number, story: Prisma.SeriesUncheckedCreateInput): Promise<SeriesPlus> => {
    return await SeriesActions.insert(libraryId, story);
}

export const remove = async (libraryId: number, storyId: number): Promise<SeriesPlus> => {
    return await SeriesActions.remove(libraryId, storyId);
}

export const storyConnect = async (libraryId: number, seriesId: number, storyId: number): Promise<SeriesPlus> =>{
    return await SeriesActions.storyConnect(libraryId, seriesId, storyId);
}

export const storyDisconnect = async (libraryId: number, seriesId: number, storyId: number): Promise<SeriesPlus> => {
    return await SeriesActions.storyDisconnect(libraryId, seriesId, storyId);
}

export const update = async (libraryId: number, storyId: number, story: Prisma.SeriesUpdateInput): Promise<SeriesPlus> => {
    return await SeriesActions.update(libraryId, storyId, story);
}

