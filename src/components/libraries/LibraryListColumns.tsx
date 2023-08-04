"use client"

// app/libraries/columns.tsx

/**
 * Column definitions for LibrariesTable.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";
import {
    Library,
} from "@prisma/client";
import {ColumnDef} from "@tanstack/table-core";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";

// Public Objects ------------------------------------------------------------

export const LibraryListColumns: ColumnDef<Library>[] = [
    {
        accessorKey: "name",
        cell: ({row}) => {
            const library = row.original;
            <Link href={`/libraries/${library.id}`}>
                NAME:
            </Link>
        },
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
    },
/*
    {
        accessorKey: "actions",
        cell: ({row}) => {
            const id = row.original.id;
            return (
                <div className="bg-primary-700 hover:bg-primary-900 text-slate-50 rounded">
                    <Link href={`/libraries/${id}`}>
                        <div>
                            <Icons.Edit className="mr-2"/>
                        </div>
                    </Link>
                </div>
/!*
                <Button
                    onClick={() => router.push(`/libraries/{id}`)}
                    variant="primary"
                >
                    <Icons.Edit className="mr-2"/>
                    Edit
                </Button>
*!/
            );
        },
        header: "Actions",
    }
*/
];
