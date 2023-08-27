"use client"

// components/libraries/LibraryList.tsx

/**
 * Render the specified Libraries in a table.  Perform callbacks to the
 * parent component when any filter criteria are changed.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useState} from "react";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {AddButton} from "@/components/shared/AddButton";
import {BackButton} from "@/components/shared/BackButton";
import {CheckBox} from "@/components/shared/CheckBox";
import {EditButton} from "@/components/shared/EditButton";
import {Pagination} from "@/components/shared/Pagination";
import {SearchBar} from "@/components/shared/SearchBar";
import {LibraryPlus} from "@/types/models/Library";
import {HandleAction, HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type LibraryListProps = {
    // Handle new value for the "active" filter
    handleActive: HandleBoolean;
    // Handle "next page" click
    handleNext: HandleAction;
    // Handle "previous page" click
    handlePrevious: HandleAction;
    // Handle new value for the "search" filter
    handleSearch: HandleString;
    // Array of Libraries to be presented
    libraries: LibraryPlus[],
    // Number of libraries per page
    pageSize: number,
}

export default function LibraryList(props: LibraryListProps) {

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");

    const handleActive: HandleBoolean = (newActive) => {
        console.log("LibrariesList.handleActive", `'${newActive}'`);
        setActive(newActive);
        props.handleActive(newActive);
    }

    const handleNext: HandleAction = () => {
        props.handleNext();
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        props.handlePrevious();
        setCurrentPage(currentPage - 1);
    }

    const handleSearch: HandleString = (newSearch) => {
        console.log("LibrariesList.handleSearch", `'${newSearch}')`);
        setSearch(newSearch);
        props.handleSearch(newSearch);
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
                        lastPage={(props.libraries.length === 0) ||
                            (props.libraries.length < props.pageSize)}
                    />
                </div>
            </div>

            <div className="container mx-auto">
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
                        {props.libraries.map((library, index) => (
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
