"use client"

// app/libraries/page.tsx

/**
 * React component for the "/libraries" page.  This is a server component,
 * so we delegate user authorization to the LibrariesList client component
 * that actually renders the table.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState, useTransition} from "react";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import LibraryList from "@/components/libraries/LibraryList";
import {CheckBox} from "@/components/shared/CheckBox";
import {SearchBar} from "@/components/shared/SearchBar";
import {LibraryAllOptions, LibraryPlus} from "@/types/models/Library";
import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

export default function LibrariesPage() {

    const [active, setActive] = useState<boolean>(false);
    const [libraries, setLibraries] = useState<LibraryPlus[]>([]);
    const [search, setSearch] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        console.log("/libraries", {
            active: active,
            search: search,
        });
        startTransition(async ()  => {
            const options: LibraryAllOptions = {
                active: (active === true) ? true : undefined,
                name: (search.length > 0) ? search : undefined,
            };
            const results = await LibraryActions.all(options);
            console.log("/libraries", JSON.stringify(results));
            setLibraries(results);
        });
    }, [active, search])


    const handleActive: HandleBoolean = (newActive) => {
        setActive(newActive);
    }

    const handleSearch: HandleString = (newSearch) => {
        setSearch(newSearch);
    }

//    const libraries: LibraryPlus[] = []; //await getLibraries();
    return (
        <div className="container mx-auto py-6">
            <>
                <div className="grid grid-cols-2">
                    <div className="text-left">
                        <SearchBar
                            autoFocus={true}
                            handleChange={handleSearch}
                            label="Search for Libraries:"
                            value={search}
                        />
                    </div>
                    <div className="text-right">
                        <CheckBox
                            label="Active Only?"
                            value={active}
                        />
                    </div>
                </div>
                <LibraryList libraries={libraries}/>
            </>
        </div>
    )
}
