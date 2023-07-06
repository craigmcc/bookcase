// app/libraries/page.tsx

/**
 * React component fo the "/libraries" page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Library,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {columns} from "./columns";
import {DataTable} from "@/components/shared/DataTable";
import * as LibraryActions from "@/actions/LibraryActions";

// Public Objects ------------------------------------------------------------

async function getData(): Promise<LibraryActions.LibraryPlus[]> {
    return await LibraryActions.all();
}

export default async function LibrariesPage() {
    const data = await getData();
    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data}/>
        </div>
    )
}
