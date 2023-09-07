"use server"

// app/users/page.tsx

/**
 * Route for the listing page for User objects.  Performs authorization checks
 * for the route, and delegates to UserList for fetching and rendering.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

// Internal Modules ----------------------------------------------------------

import UsersList from "@/components/users/UserList";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function UsersRoute() {

    // Validate access to this route
    const session = await getServerSession(authOptions);
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
