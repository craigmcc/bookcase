"use client"

// components/users/UserList.tsx

/**
 * Render the specified Users in a table.  Perform callbacks to the
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
import {SearchBar} from "@/components/shared/SearchBar";
import {UserPlus} from "@/types/models/User";
import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type UserListProps = {
    // Handle new value for the "active" filter
    handleActive: HandleBoolean;
    // Handle new value for the "search" filter
    handleSearch: HandleString;
    // Array of Users to be presented
    users: UserPlus[],
}

export default function UserList(props: UserListProps) {

    const [active, setActive] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

    const handleActive: HandleBoolean = (newActive) => {
        console.log("UsersList.handleActive", `'${newActive}'`);
        setActive(newActive);
        props.handleActive(newActive);
    }

    const handleSearch: HandleString = (newSearch) => {
        console.log("UsersList.handleSearch", `'${newSearch}')`);
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
                    <strong>Manage Users</strong>
                </div>
                <div className="text-right">
                    <AddButton href={"/users/-1"}/>
                </div>
            </div>

            <div className="grid grid-cols-2 py-4">
                <div className="text-left">
                    <SearchBar
                        autoFocus={true}
                        handleChange={handleSearch}
                        label="Search for Users:"
                        placeholder="Search by all or part of username"
                        value={search}
                    />
                </div>
                <div className="text-right">
                    <CheckBox
                        handleValue={handleActive}
                        label="Active Users Only?"
                        value={active}
                    />
                </div>
            </div>

            <div className="container mx-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Userame</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Scope</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.users.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {user.username}
                                </TableCell>
                                <TableCell>
                                    {user.active ? (
                                        <Icons.Check color="green"/>
                                    ) : (
                                        <Icons.Uncheck color="red"/>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {user.name}
                                </TableCell>
                                <TableCell>
                                    {user.scope}
                                </TableCell>
                                <TableCell>
                                    <EditButton href={`/users/${user.id}`}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
