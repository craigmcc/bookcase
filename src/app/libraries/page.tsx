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

// Public Objects ------------------------------------------------------------

/**
 * Dummy getData() method, will eventually use LibraryActions.all().
 */
async function getData(): Promise<Library[]> {
    return [
        {
            id: 101,
            active: true,
            name: "First Library",
            notes: "Notes about First Library",
            scope: "first",
        },
        {
            id: 102,
            active: false,
            name: "Second Library",
            notes: null,
            scope: "second",
        },
        {
            id: 103,
            active: true,
            name: "Third Library",
            notes: "Notes about Third Library",
            scope: "third",
        },
    ];
}

export default async function LibrariesPage() {
    const data = await getData();
    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data}/>
        </div>
    )
}
