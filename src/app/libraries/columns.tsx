"use client"

// app/libraries/columns.tsx

/**
 * Column definitions for LibrariesTable.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Library,
} from "@prisma/client";
import {ColumnDef} from "@tanstack/table-core";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const columns: ColumnDef<Library>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "active",
        cell: ({row}) => {
            return <div className="text-center">{row.getValue("active")}</div>
        },
        header: "Active",
    },
    {
        accessorKey: "notes",
        header: "Notes",
    },
    {
        accessorKey: "scope",
        header: "Scope",
    }
];
