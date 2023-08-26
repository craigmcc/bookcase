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
import {Library} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

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
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {StoryAllOptions, StoryPlus} from "@/types/models/Story";
//import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type StoryItemsProps = {
    // Library for which to retrieve Stories
    library: Library;
    // TODO - will need other parent types in the future
    // TODO - will need navigation actions?
}

export default function StoryItems(props: StoryItemsProps) {

    const [active, setActive] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [stories, setStories] = useState<StoryPlus[]>([]);

    // Select the Stories that match the specified filter criteria
    useEffect(() => {

        async function fetchStories() {
            const options: StoryAllOptions = {
                active: (active) ? true : undefined,
                name: (search.length > 0) ? search : undefined,
            }
            const results = await StoryActions.all(props.library.id, options);
            setStories(results);
        }

        fetchStories();

    }, [active, search, props.library]);

    // No access validation needed, since this is not a page

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Stories</CardTitle>
                <CardContent>
                    <Table className="container mx-auto">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stories.map((story, index) => (
                                <TableRow key={index}>
                                    <TableCell>
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
