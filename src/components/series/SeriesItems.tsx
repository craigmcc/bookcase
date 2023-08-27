"use client"

// components/serieses/SeriesItems.tsx

/**
 * Abbreviated list of Series that relate to a particular type of parent
 * object, and provides various actions to trigger related UX activities.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";
import {Library} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as SeriesActions from "@/actions/SeriesActionsShim";
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
import {SeriesAllOptions, SeriesPlus} from "@/types/models/Series";
//import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type SeriesItemsProps = {
    // Library for which to retrieve Series
    library: Library;
    // TODO - will need other parent types in the future
    // TODO - will need navigation actions?
}

export default function SeriesItems(props: SeriesItemsProps) {

    const [active, setActive] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [serieses, setSerieses] = useState<SeriesPlus[]>([]);

    // Select the Series that match the specified filter criteria
    useEffect(() => {

        async function fetchSeries() {
            const options: SeriesAllOptions = {
                active: (active) ? true : undefined,
                name: (search.length > 0) ? search : undefined,
            }
            const results = await SeriesActions.all(props.library.id, options);
            setSerieses(results);
        }

        fetchSeries();

    }, [active, search, props.library]);

    // No access validation needed, since this is not a page

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Series</CardTitle>
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
                            {serieses.map((series, index) => (
                                <TableRow key={index}>
                                    <TableCell className="p-1">
                                        {series.name}
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
