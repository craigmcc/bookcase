"use server"

// app/libraries/page.tsx

/**
 * Route for the listing page for Library objects.  Performs authorization
 * checks for the route, and delegates to LibraryList for fetching and
 * rendering.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/authOptions";

// Internal Modules ----------------------------------------------------------

import LibrariesList from "@/components/libraries/LibraryList";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function LibrariesRoute() {

    // Validate access to this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    return (
        <div className="container py-4" suppressHydrationWarning>
            <LibrariesList/>
        </div>
    )
}
