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
import {StoryAllOptions, StoryPlus} from "@/types/models/Story";
import {VolumePlus} from "@/types/models/Volume";
//import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type StoryItemsProps = {
    // Parent model for which to retrieve Stories
    parent: AuthorPlus | LibraryPlus | SeriesPlus | VolumePlus;
    // TODO - will need navigation actions?
}

export default function StoryItems(props: StoryItemsProps) {

    const [active, setActive] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [stories, setStories] = useState<StoryPlus[]>([]);

    // Select the Stories that match the specified filter criteria
    useEffect(() => {

        async function fetchStories() {

            console.log("StoryItems Parent", JSON.stringify(props.parent));

            // @ts-ignore
            const _model = props.parent["_model"];
            switch (_model) {

                // TODO: case "Author":

                case "Library":
                    setStories(await StoryActions.all(props.parent.id, {
                        active: (active) ? true : undefined,
                        name: (search.length > 0) ? search : undefined,
                    }));
                    break;

                // TODO: case "Series":

                case "Volume":
                    // @ts-ignore
                    setStories(await VolumeActions.stories(props.parent.libraryId, props.parent.id));
                    break;

                default:
                    alert(`StoryItems: Unsupported parent model ${_model}`);
                    setStories([]);
                    break;

            }

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
