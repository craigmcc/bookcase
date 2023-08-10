"use server"

// actions/LibraryActionsShim.ts

/**
 * Attempt to work around Jest's rejection of modules that have "use server"
 * at the top, by providing a shim that just delegates to those real functions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "./LibraryActions";
import {
    LibraryAllOptions,
    LibraryFindOptions,
    LibraryPlus,
} from "@/types/models/Library";

// Public Functions ----------------------------------------------------------

export const all = async (options?: LibraryAllOptions): Promise<LibraryPlus[]> => {
    return await LibraryActions.all(options);
}

export const exact = async (name: string, options?: LibraryFindOptions): Promise<LibraryPlus> => {
    return await LibraryActions.exact(name, options);
}

export const find = async (libraryId: number, options?: LibraryFindOptions): Promise<LibraryPlus> => {
    return await LibraryActions.find(libraryId, options);
}

export const insert = async (library: Prisma.LibraryCreateInput): Promise<LibraryPlus> => {
    return await LibraryActions.insert(library);
}

export const remove = async (libraryId: number): Promise<LibraryPlus> => {
    return await LibraryActions.remove(libraryId);
}

export const update = async (libraryId: number, library: Prisma.LibraryUpdateInput): Promise<LibraryPlus> => {
    return await LibraryActions.update(libraryId, library);
}
