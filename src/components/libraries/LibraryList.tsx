"use client"

// components/libraries/LibraryList.tsx

/**
 * Render the specified Libraries in a table, applying user specified
 * filtering as required.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import {Icons} from "@/components/layout/Icons";
import {AddButton} from "@/components/shared/AddButton";
import {BackButton} from "@/components/shared/BackButton";
import {CheckBox} from "@/components/shared/CheckBox";
import {EditButton} from "@/components/shared/EditButton";
import {Pagination} from "@/components/shared/Pagination";
import {SearchBar} from "@/components/shared/SearchBar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {LibraryAllOptions, LibraryPlus} from "@/types/models/Library";
import {HandleAction, HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type LibraryListProps = {
}

export default function LibraryList(props: LibraryListProps) {

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [libraries, setLibraries] = useState<LibraryPlus[]>([]);
    const pageSize = 2;
    const [search, setSearch] = useState<string>("");

    // Select the Libraries that match the specified filter criteria
    useEffect(() => {

        async function fetchLibraries()  {
            const options: LibraryAllOptions = {
                active: (active) ? true : undefined,
                limit: pageSize,
                name: (search.length > 0) ? search : undefined,
                offset: (pageSize * (currentPage - 1)),
            };
            const results = await LibraryActions.all(options);
            //console.log("LibrariesPage.fetched", JSON.stringify(results));
            setLibraries(results);
        }

        fetchLibraries();

    }, [active, currentPage, search])

    // No access validation is required because we are not a page

    const handleActive: HandleBoolean = (newActive) => {
//        console.log("LibrariesList.handleActive", `'${newActive}'`);
        setActive(newActive);
    }

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleSearch: HandleString = (newSearch) => {
//        console.log("LibrariesList.handleSearch", `'${newSearch}')`);
        setSearch(newSearch);
    }

    // Render the requested content
    return (
        <>

            <div className="grid grid-cols-3">
                <div className="text-left">
                    <BackButton href="/select"/>
                </div>
                <div className="text-center items-center">
                    <strong>Manage Libraries</strong>
                </div>
                <div className="text-right">
                    <AddButton href={"/libraries/-1"}/>
                </div>
            </div>

            <div className="grid grid-cols-2 py-4">
                <div className="text-left">
                    <SearchBar
                        autoFocus={true}
                        handleChange={handleSearch}
                        label="Search for Libraries:"
                        placeholder="Search by all or part of name"
                        value={search}
                    />
                </div>
                <div className="flex gap-4 justify-end">
                    <CheckBox
                        handleValue={handleActive}
                        label="Active Libraries Only?"
                        value={active}
                    />
                    <Pagination
                        currentPage={currentPage}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        lastPage={(libraries.length === 0) ||
                            (libraries.length < pageSize)}
                    />
                </div>
            </div>

            <div className="container px-0 mx-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Scope</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {libraries.map((library, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {library.name}
                                </TableCell>
                                <TableCell>
                                    {library.active ? (
                                        <Icons.Check color="green"/>
                                    ) : (
                                        <Icons.Uncheck color="red"/>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {library.notes}
                                </TableCell>
                                <TableCell>
                                    {library.scope}
                                </TableCell>
                                <TableCell>
                                    <EditButton href={`/libraries/${library.id}`}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
