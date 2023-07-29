"use client"

// app/components/libraries/LibrariesList.tsx

/**
 * React component containing the list of Libraries for the "/libraries" page.
 * This needs to be a client component so that it is not async, and can
 * therefore use the useSession() hook from next-auth.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useSession} from "next-auth/react";

// Internal Modules ----------------------------------------------------------

import {columns} from "./columns";
import * as LibraryActions from "@/actions/LibraryActions";
import {DataTable} from "@/components/shared/DataTable";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

type LibrariesListProps = {
    libraries: LibraryActions.LibraryPlus[],
}

export default function LibrariesList(props: LibrariesListProps) {

    // Validate access to this function
    const {data: session} = useSession();
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    // Render the requested content
    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={props.libraries}/>
        </div>
    )
}
