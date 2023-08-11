"use client"

// app/libraries/page.tsx

/**
 * Routing page for "/libraries".  Performs authorization checks for the
 * route, and retrieves the Libraries that match the specified filter
 * criteria.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useSession} from "next-auth/react";
import {useEffect, useState, useTransition} from "react";

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
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        console.log("LibrariesPage.useEffect", {
            active: active,
            search: search,
        });
        startTransition(async ()  => {
            const options: LibraryAllOptions = {
                active: (active) ? true : undefined,
                name: (search.length > 0) ? search : undefined,
            };
            const results = await LibraryActions.all(options);
            console.log("LibrariesPage", JSON.stringify(results));
            setLibraries(results);
        });
    }, [active, search])

    // Validate access to this function
    const {data: session} = useSession();
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    const handleActive: HandleBoolean = (newActive) => {
        setActive(newActive);
    }

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
