"use client"

// app/users/page.tsx

/**
 * Listing page for User objects.  Performs authorization checks for
 * the route, and delegates to UserList for fetching and rendering.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useSession} from "next-auth/react";

// Internal Modules ----------------------------------------------------------

import UsersList from "@/components/users/UserList";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default function UsersPage() {

    // Validate access to this page
    const {data: session} = useSession();
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    return (
        <div className="container py-4" suppressHydrationWarning>
            <UsersList/>
        </div>
    )
}
