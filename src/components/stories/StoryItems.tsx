"use client"

// components/stories/StoryItems.tsx

/**
 * Abbreviated list of Stories that relate to a particular type of parent
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

type StoryItemsProps = {
    // Parent model for which to retrieve Stories
    parent: AuthorPlus | LibraryPlus | SeriesPlus | VolumePlus;
    // Show ordinal values? [false]
    showOrdinal?: boolean;
    // TODO - will need navigation actions?
}

export default function StoryItems(props: StoryItemsProps) {

    const [active, setActive] = useState<boolean>(false);
    const [ordinals, setOrdinals] = useState<number[]>([]);
    const [search, setSearch] = useState<string>("");
    const [stories, setStories] = useState<StoryPlus[]>([]);

    // Select the Stories that match the specified filter criteria
    useEffect(() => {

        async function fetchStories() {

            console.log("StoryItems Parent", JSON.stringify(props.parent));

            // @ts-ignore
            const _model = props.parent["_model"];
            let results: StoryPlus[] = [];
            switch (_model) {

                case "Author":
                    // @ts-ignore
                    results = await AuthorActions.stories(props.parent.libraryId, props.parent.id);
                    break;

                case "Library":
                    results = await StoryActions.all(props.parent.id, {
                        active: (active) ? true : undefined,
                        name: (search.length > 0) ? search : undefined,
                    });
                    break;

                case "Series":
                    // @ts-ignore
                    results = await SeriesActions.stories(props.parent.libraryId, props.parent.id);
                    break;

                case "Volume":
                    // @ts-ignore
                    results = await VolumeActions.stories(props.parent.libraryId, props.parent.id);
                    break;

                default:
                    alert(`StoryItems: Unsupported parent model ${_model}`);
                    results =[];
                    break;

            }

            // TODO: sort by ordinal/name first?
            setStories(results);

            // Save ordinals in case we were requested to display them
            const ords: number[] = [];
            for (const result of results) {
                // @ts-ignore
                ords.push(Number(result["_ordinal"]));
            }
            setOrdinals(ords);

        }

        fetchStories();

    }, [active, search, props.parent]);

    // No access validation needed, since this is not a page

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Stories</CardTitle>
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
                            {stories.map((story, index) => (
                                <TableRow key={index}>
                                    <TableCell className="p-1">
                                        {props.showOrdinal ? (
                                            <span>({ordinals[index]})&nbsp;</span>
                                        ) : null }
                                        {story.name}
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
