// SharedContext -------------------------------------------------------------

// React Context containing selected objects of particular types that can be
// shared across views and subviews.  Updates to these objects are on an honor
// system, not (currently) managed with authorization constraints.

// External Modules ----------------------------------------------------------

import React, { createContext, useState } from "react";

// Internal Modules ----------------------------------------------------------

import Library from "../models/Library";

// Context Properties --------------------------------------------------------

export interface Props {
    children: React.ReactNode;
}

export type SharedContextType = {
    library: Library;
    setLibrary: (library: Library) => any;
    refreshLibraries: boolean;
    setRefreshLibraries: (flag: boolean) => any;
}

// Context Details ------------------------------------------------------------

const DEFAULT_SET_LIBRARY = (library: Library) => { }
const DEFAULT_SET_REFRESH_LIBRARIES = (flag: boolean) => { }

const DEFAULT_VALUE: SharedContextType = {
    library: { id: -1, active: false, name: "Uninitialized" },
    setLibrary: DEFAULT_SET_LIBRARY,
    refreshLibraries: false,
    setRefreshLibraries: DEFAULT_SET_REFRESH_LIBRARIES,
}

export const SharedContext = createContext<SharedContextType>(DEFAULT_VALUE);

export const SharedContextProvider = (props: any) => {

    // React state corresponding to the context values
    const [library, setLibrary] =
        useState<Library>({ id: -1, active: false, name: "Unknown"});
    const [refreshLibraries, setRefreshLibraries] = useState<boolean>(false);

    // Create the context object
    const sharedContext: SharedContextType = {
        library: library,
        setLibrary: setLibrary,
        refreshLibraries: false,
        setRefreshLibraries: setRefreshLibraries,
    };

    // Return it, rendering children inside
    return (
        <SharedContext.Provider value={sharedContext}>
            {props.children}
        </SharedContext.Provider>
    );

}
