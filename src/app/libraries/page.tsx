"use client"

// app/libraries/page.tsx

/**
 * Listing page for Library objects.  Performs authorization checks for
 * the route, and retrieves the Libraries that match the specified filter
 * criteria.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import LibrariesList from "@/components/libraries/LibraryList";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {LibraryAllOptions, LibraryPlus} from "@/types/models/Library";
import {HandleBoolean, HandleString} from "@/types/types";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default function LibrariesPage() {

    const [active, setActive] = useState<boolean>(false);
    const [libraries, setLibraries] = useState<LibraryPlus[]>([]);
    const [search, setSearch] = useState<string>("");

    // Select the Libraries that match the specified filter criteria
    useEffect(() => {

        async function fetchLibraries()  {
            const options: LibraryAllOptions = {
                active: (active) ? true : undefined,
                name: (search.length > 0) ? search : undefined,
            };
            const results = await LibraryActions.all(options);
            //console.log("LibrariesPage.fetched", JSON.stringify(results));
            setLibraries(results);
        }

        fetchLibraries();

    }, [active, search])

    // Validate access to this function
    const {data: session} = useSession();
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    // Handle changes to the "active" filter.
    const handleActive: HandleBoolean = (newActive) => {
        setActive(newActive);
    }

    // Handle changes to the "search" filter.
    const handleSearch: HandleString = (newSearch) => {
        setSearch(newSearch);
    }

    return (
        <div className="container mx-auto py-6" suppressHydrationWarning>
            <LibrariesList
                handleActive={handleActive}
                handleSearch={handleSearch}
                libraries={libraries}
            />
        </div>
    )
}
