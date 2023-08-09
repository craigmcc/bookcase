"use server"

// actions/LibraryActionsShim.ts

/**
 * Attempt to work around Jest's rejection of pages that have "use server"
 * at the top, by providing a shim that just delegates to the real functions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "./LibraryActions";
import {
    LibraryAllOptions,
    LibraryFindOptions,
    LibraryIncludeOptions,
    LibraryMatchOptions,
    LibraryPlus,
} from "@/types/models/Library";

// Public Functions ----------------------------------------------------------

export const all = async (options?: LibraryAllOptions): Promise<LibraryPlus[]> => {
    return await LibraryActions.all(options);
}

