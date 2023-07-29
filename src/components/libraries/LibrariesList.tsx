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

// Public Objects ------------------------------------------------------------

type LibrariesListProps = {
    libraries: LibraryActions.LibraryPlus[],
}

export default function LibrariesList(props: LibrariesListProps) {
    const {data: session} = useSession();
    // TODO: validate signed in user that is a superuser
    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={props.libraries}/>
        </div>
    )
}
