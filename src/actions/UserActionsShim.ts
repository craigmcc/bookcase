"use server"

// actions/UserActionsShim.ts

/**
 * Attempt to work around Jest's rejection of modules that have "use server"
 * at the top, by providing a shim that just delegates to those real functions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as UserActions from "./UserActions";
import {
    UserAllOptions,
    UserFindOptions,
    UserPlus,
} from "@/types/models/User";

// Public Functions ----------------------------------------------------------

export const all = async (options?: UserAllOptions): Promise<UserPlus[]> => {
    return await UserActions.all(options);
}

export const exact = async (name: string, options?: UserFindOptions): Promise<UserPlus> => {
    return await UserActions.exact(name, options);
}

export const find = async (libraryId: number, options?: UserFindOptions): Promise<UserPlus> => {
    return await UserActions.find(libraryId, options);
}

export const insert = async (library: Prisma.UserCreateInput): Promise<UserPlus> => {
    return await UserActions.insert(library);
}

export const remove = async (libraryId: number): Promise<UserPlus> => {
    return await UserActions.remove(libraryId);
}

export const update = async (libraryId: number, library: Prisma.UserUpdateInput): Promise<UserPlus> => {
    return await UserActions.update(libraryId, library);
}
