"use server"

// actions/AuthorActionsShim.ts

/**
 * Attempt to work around Jest's rejection of modules that have "use server"
 * at the top, by providing a shim that just delegates to those real functions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "./AuthorActions";
import {
    AuthorAllOptions,
    AuthorFindOptions,
    AuthorPlus,
} from "@/types/models/Author";

// Public Functions ----------------------------------------------------------

export const all = async (libraryId: number, options?: AuthorAllOptions): Promise<AuthorPlus[]> => {
    return await AuthorActions.all(libraryId, options);
}

export const exact = async (libraryId: number, firstName: string, lastName: string, options?: AuthorFindOptions): Promise<AuthorPlus> => {
    return await AuthorActions.exact(libraryId, firstName, lastName, options);
}

export const find = async (libraryId: number, volumeId: number, options?: AuthorFindOptions): Promise<AuthorPlus> => {
    return await AuthorActions.find(libraryId, volumeId, options);
}

export const insert = async(libraryId: number, volume: Prisma.AuthorUncheckedCreateInput): Promise<AuthorPlus> => {
    return await AuthorActions.insert(libraryId, volume);
}

export const remove = async (libraryId: number, volumeId: number): Promise<AuthorPlus> => {
    return await AuthorActions.remove(libraryId, volumeId);
}

export const seriesConnect =
    async (libraryId: number, authorId: number, seriesId: number, principal?: boolean): Promise<AuthorPlus> => {
        return AuthorActions.seriesConnect(libraryId, authorId, seriesId, principal);
    }

export const seriesDisconnect =
    async (libraryId: number, authorId: number, seriesId: number): Promise<AuthorPlus> => {
        return await AuthorActions.seriesDisconnect(libraryId, authorId, seriesId);
    }

export const storyConnect = async (libraryId: number, authorId: number, storyId: number): Promise<AuthorPlus> =>{
    return await AuthorActions.storyConnect(libraryId, authorId, storyId);
}

export const storyDisconnect = async (libraryId: number, authorId: number, storyId: number): Promise<AuthorPlus> => {
    return await AuthorActions.storyDisconnect(libraryId, authorId, storyId);
}

export const update = async (libraryId: number, volumeId: number, volume: Prisma.AuthorUpdateInput): Promise<AuthorPlus> => {
    return await AuthorActions.update(libraryId, volumeId, volume);
}

export const volumeConnect = async (libraryId: number, authorId: number, volumeId: number, principal?: boolean): Promise<AuthorPlus> =>{
    return await AuthorActions.volumeConnect(libraryId, authorId, volumeId, principal);
}

export const volumeDisconnect = async (libraryId: number, authorId: number, volumeId: number): Promise<AuthorPlus> => {
    return await AuthorActions.volumeDisconnect(libraryId, authorId, volumeId);
}
