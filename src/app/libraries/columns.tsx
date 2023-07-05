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

import {Icons} from "@/components/layout/Icons";

// Public Objects ------------------------------------------------------------

export const columns: ColumnDef<Library>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "active",
        cell: ({row}) => {
            const value = Boolean(row.getValue("active"));
            return value
                ? <Icons.Check color="green"/>
                : <Icons.Uncheck color="red"/>
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
