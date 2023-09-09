"use server"

// actions/VolumeActionsShim.ts

/**
 * Attempt to work around Jest's rejection of modules that have "use server"
 * at the top, by providing a shim that just delegates to those real functions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as VolumeActions from "./VolumeActions";
import {AuthorAllOptions, AuthorPlus} from "@/types/models/Author";
import {StoryAllOptions, StoryPlus} from "@/types/models/Story";
import {
    VolumeAllOptions,
    VolumeFindOptions,
    VolumePlus,
} from "@/types/models/Volume";

// Public Functions ----------------------------------------------------------

export const all = async (libraryId: number, options?: VolumeAllOptions): Promise<VolumePlus[]> => {
    return await VolumeActions.all(libraryId, options);
}

export const authorConnect =
    async (libraryId: number, volumeId: number, authorId: number, principal?: boolean): Promise<VolumePlus> => {
    return VolumeActions.authorConnect(libraryId, volumeId, authorId, principal);
}

export const authorDisconnect =
    async (libraryId: number, volumeId: number, authorId: number): Promise<VolumePlus> => {
    return await VolumeActions.authorDisconnect(libraryId, volumeId, authorId);
}

export const authors =
    async (libraryId: number, volumeId: number, options?: AuthorAllOptions): Promise<AuthorPlus[]> => {
    return await VolumeActions.authors(libraryId, volumeId, options);
}

export const exact = async (libraryId: number, name: string, options?: VolumeFindOptions): Promise<VolumePlus> => {
    return await VolumeActions.exact(libraryId, name, options);
}

export const find = async (libraryId: number, volumeId: number, options?: VolumeFindOptions): Promise<VolumePlus> => {
    return await VolumeActions.find(libraryId, volumeId, options);
}

export const insert = async(libraryId: number, volume: Prisma.VolumeUncheckedCreateInput): Promise<VolumePlus> => {
    return await VolumeActions.insert(libraryId, volume);
}

export const remove = async (libraryId: number, volumeId: number): Promise<VolumePlus> => {
    return await VolumeActions.remove(libraryId, volumeId);
}

export const storyConnect = async (libraryId: number, volumeId: number, storyId: number): Promise<VolumePlus> =>{
    return await VolumeActions.storyConnect(libraryId, volumeId, storyId);
}

export const storyDisconnect = async (libraryId: number, volumeId: number, storyId: number): Promise<VolumePlus> => {
    return await VolumeActions.storyDisconnect(libraryId, volumeId, storyId);
}

export const stories =
    async (libraryId: number, volumeId: number, options?: StoryAllOptions): Promise<StoryPlus[]> => {
        return await VolumeActions.stories(libraryId, volumeId, options);
    }

export const update = async (libraryId: number, volumeId: number, volume: Prisma.VolumeUpdateInput): Promise<VolumePlus> => {
    return await VolumeActions.update(libraryId, volumeId, volume);
}
