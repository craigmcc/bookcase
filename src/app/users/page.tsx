"use client"

// app/users/page.tsx

/**
 * Listing page for User objects.  Performs authorization checks for
 * the route, and retrieves the Users that match the specified filter
 * criteria.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import * as UserActions from "@/actions/UserActionsShim";
import UsersList from "@/components/users/UserList";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {UserAllOptions, UserPlus} from "@/types/models/User";
import {HandleBoolean, HandleString} from "@/types/types";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default function UsersPage() {

    const [active, setActive] = useState<boolean>(false);
    const [users, setUsers] = useState<UserPlus[]>([]);
    const [search, setSearch] = useState<string>("");

    // Select the Users that match the specified filter criteria
    useEffect(() => {
        /*
                console.log("UsersPage.useEffect", {
                    active: active,
                    search: search,
                });
        */
        async function fetchUsers() {
            const options: UserAllOptions = {
                active: (active) ? true : undefined,
                username: (search.length > 0) ? search : undefined,
            };
            const results = await UserActions.all(options);
            //console.log("UsersPage.fetched", JSON.stringify(results));
            setUsers(results);
        }

        fetchUsers();

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
            <UsersList
                handleActive={handleActive}
                handleSearch={handleSearch}
                users={users}
            />
        </div>
    )
}
