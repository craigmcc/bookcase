"use client"

// components/libraries/LibraryList.tsx

/**
 * Rendering the specified list of Libraries.  Perform callbacks to
 * parent component when the filter criteria are changed.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useState} from "react";

// Internal Modules ----------------------------------------------------------

import {AddButton} from "@/components/shared/AddButton";
import {BackButton} from "@/components/shared/BackButton";
import {EditButton} from "@/components/shared/EditButton";
import {Icons} from "@/components/layout/Icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {LibraryPlus} from "@/types/models/Library";
import {HandleBoolean, HandleString} from "@/types/types";
import {SearchBar} from "@/components/shared/SearchBar";
import {CheckBox} from "@/components/shared/CheckBox";

// Public Objects ------------------------------------------------------------

type LibraryListProps = {
    // Handle new value for the "active" filter
    handleActive: HandleBoolean;
    // Handle new value for the "search" filter
    handleSearch: HandleString;
    // Array of Libraries to be presented
    libraries: LibraryPlus[],
}

export default function LibraryList(props: LibraryListProps) {

    const [active, setActive] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

    const handleActive: HandleBoolean = (newActive) => {
        console.log("LibrariesList.handleActive", `'${newActive}'`);
        setActive(newActive);
        props.handleActive(newActive);
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
                <div className="text-right">
                    <CheckBox
                        handleValue={handleActive}
                        label="Active Libraries Only?"
                        value={active}
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
