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

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "@/actions/AuthorActionsShim";
import * as SeriesActions from "@/actions/SeriesActionsShim";
import * as StoryActions from "@/actions/StoryActionsShim";
import * as VolumeActions from "@/actions/VolumeActionsShim";
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
import {SeriesPlus} from "@/types/models/Series";
import {StoryPlus} from "@/types/models/Story";
import {VolumePlus} from "@/types/models/Volume";
//import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type AuthorItemsProps = {
    // Parent model for which to retrieve Authors
    parent: LibraryPlus | SeriesPlus | StoryPlus | VolumePlus;
    // TODO - will need navigation actions?
}

export default function AuthorItems(props: AuthorItemsProps) {

    const [active, setActive] = useState<boolean>(false);
    const [authors, setAuthors] = useState<AuthorPlus[]>([]);
    const [search, setSearch] = useState<string>("");

    // Select the Authors that match the specified filter criteria
    useEffect(() => {

        async function fetchAuthors() {

            console.log("AuthorItems Parent", JSON.stringify(props.parent));

            // @ts-ignore
            const _model = props.parent["_model"];
            switch (_model) {

                case "Library":
                    setAuthors(await AuthorActions.all(props.parent.id, {
                        active: (active) ? true : undefined,
                        name: (search.length > 0) ? search : undefined,
                    }));
                    break;

                case "Series":
                    // @ts-ignore
                    setAuthors(await SeriesActions.authors(props.parent.libraryId, props.parent.id));
                    break;

                case "Story":
                    // @ts-ignore
                    setAuthors(await StoryActions.authors(props.parent.libraryId, props.parent.id));
                    break;

                case "Volume":
                    // @ts-ignore
                    setAuthors(await VolumeActions.authors(props.parent.libraryId, props.parent.id));
                    break;

                default:
                    alert(`AuthorItems: Unsupported parent model ${_model}`);
                    setAuthors([]);
                    break;

            }

        }

        fetchAuthors();

    }, [active, search, props.parent]);

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
                            {authors.map((author, index) => (
                                <TableRow key={index}>
                                    <TableCell className="p-1">
                                        {author.lastName}, {author.firstName}
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
