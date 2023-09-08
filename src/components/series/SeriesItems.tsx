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

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "@/actions/AuthorActionsShim";
import * as SeriesActions from "@/actions/SeriesActionsShim";
import * as StoryActions from "@/actions/StoryActionsShim";
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
import {AuthorPlus} from "@/types/models/Author";
import {LibraryPlus} from "@/types/models/Library";
import {StoryPlus} from "@/types/models/Story";
import {SeriesAllOptions, SeriesPlus} from "@/types/models/Series";
//import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type SeriesItemsProps = {
    // Parent model for which to retrieve Series
    parent: AuthorPlus | LibraryPlus | StoryPlus;
    // TODO - will need navigation actions?
}

export default function SeriesItems(props: SeriesItemsProps) {

    const [active, setActive] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [serieses, setSerieses] = useState<SeriesPlus[]>([]);

    // Select the Series that match the specified filter criteria
    useEffect(() => {

        async function fetchSeries() {

            console.log("SeriesItems Parent", JSON.stringify(props.parent));

            // @ts-ignore
            const _model = props.parent["_model"];
            switch (_model) {

                case "Author":
                    // @ts-ignore
                    setSerieses(await AuthorActions.series(props.parent.libraryId, props.parent.id));
                    break;

                case "Library":
                    setSerieses(await SeriesActions.all(props.parent.id, {
                        active: (active) ? true : undefined,
                        name: (search.length > 0) ? search : undefined,
                    }));
                    break;

                case "Story":
                    // @ts-ignore
                    setSerieses(await StoryActions.series(props.parent.libraryId, props.parent.id));
                    break;

                default:
                    alert(`SeriesItems: Unsupported parent model ${_model}`);
                    setSerieses([]);
                    break;

            }

        }

        fetchSeries();

    }, [active, search, props.parent]);

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
