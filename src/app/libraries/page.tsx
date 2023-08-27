"use client"

// app/libraries/page.tsx

/**
 * Listing page for Library objects.  Performs authorization checks for
 * the route, and delegates to LibraryList for fetching and rendering.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useSession} from "next-auth/react";

// Internal Modules ----------------------------------------------------------

import LibrariesList from "@/components/libraries/LibraryList";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default function LibrariesPage() {

    // Validate access to this page
    const {data: session} = useSession();
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
