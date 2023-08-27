"use client"

// components/stories/AuthorItems.tsx

/**
 * Abbreviated list of Authors that relate to a particular type of parent
 * object, and provides various actions to trigger related UX activities.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState, useTransition} from "react";
import {Library} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "@/actions/AuthorActionsShim";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
//    TableHead,
//    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {AuthorAllOptions, AuthorPlus} from "@/types/models/Author";
//import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type AuthorItemsProps = {
    // Library for which to retrieve Authors
    library: Library;
    // TODO - will need other parent types in the future
    // TODO - will need navigation actions?
}

export default function AuthorItems(props: AuthorItemsProps) {

    const [active, setActive] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [stories, setAuthors] = useState<AuthorPlus[]>([]);
    const [isPending, startTransition] = useTransition();

    // Select the Authors that match the specified filter criteria
    useEffect(() => {

        async function fetchAuthors() {
            const options: AuthorAllOptions = {
                active: (active) ? true : undefined,
                name: (search.length > 0) ? search : undefined,
            }
            const results = await AuthorActions.all(props.library.id, options);
            setAuthors(results);
        }

        fetchAuthors();

    }, [active, search, props.library]);

    // No access validation needed, since this is not a page

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Authors</CardTitle>
                <CardContent className="p-1">
                    <Table className="container mx-auto">
{/*
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-auto p-1">Name</TableHead>
                            </TableRow>
                        </TableHeader>
*/}
                        <TableBody>
                            {stories.map((author, index) => (
                                <TableRow key={index}>
                                    <TableCell className="p-1">
                                        {author.firstName} {author.lastName}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </CardHeader>
        </Card>
    )

}
