"use client"

// components/layout/LibraryContext.tsx

/**
 * React context to record the selected Library for the current user,
 * if there was one.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {createContext} from "react";

// Internal Modules ----------------------------------------------------------

import {LibraryPlus} from "@/types/models/Library";

// Context Properties --------------------------------------------------------

export interface LibraryContextState {
    library: LibraryPlus | null;
}

export const LibraryContext = createContext<LibraryContextState>({
    library: null,
});

export const LibraryContextProvider = (props: any) => {
    const libraryContext: LibraryContextState = {
        library: null
    }
    return (
        <LibraryContext.Provider value={libraryContext}>
            {props.children}
        </LibraryContext.Provider>
    )
}
