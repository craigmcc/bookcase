"use client"

// components/users/UserList.tsx

/**
 * Render the specified Users in a table, applying user specified
 * filtering as required.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import * as UserActions from "@/actions/UserActionsShim";
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
import {UserAllOptions, UserPlus} from "@/types/models/User";
import {HandleAction, HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type UserListProps = {
}

export default function UserList(props: UserListProps) {

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 3;
    const [search, setSearch] = useState<string>("");
    const [users, setUsers] = useState<UserPlus[]>([]);

    // Select the Users that match the specified filter criteria
    useEffect(() => {

        async function fetchUsers() {
            const options: UserAllOptions = {
                active: (active) ? true : undefined,
                limit: pageSize,
                offset: (pageSize * (currentPage - 1)),
                username: (search.length > 0) ? search : undefined,
            }
            const results = await UserActions.all(options);
            setUsers(results);
        }

        fetchUsers();

    }, [active, currentPage, search]);

    // No access validation is required because we are not a page

    const handleActive: HandleBoolean = (newActive) => {
//        console.log("UsersList.handleActive", `'${newActive}'`);
        setActive(newActive);
    }

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleSearch: HandleString = (newSearch) => {
//        console.log("UsersList.handleSearch", `'${newSearch}')`);
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
                <div className="flex gap-4 justify-end">
                    <CheckBox
                        handleValue={handleActive}
                        label="Active Users Only?"
                        value={active}
                    />
                    <Pagination
                        currentPage={currentPage}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        lastPage={(users.length === 0) ||
                            (users.length < pageSize)}
                    />
                </div>
            </div>

            <div className="container px-0 mx-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Scope</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user, index) => (
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
