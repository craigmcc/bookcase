"use client"

// components/stories/StoryItems.tsx

/**
 * Abbreviated list of Stories that relate to a particular type of parent
 * object, and provides various actions to trigger related UX activities.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "@/actions/AuthorActionsShim";
import * as SeriesActions from "@/actions/SeriesActionsShim";
import * as StoryActions from "@/actions/StoryActionsShim";
import * as VolumeActions from "@/actions/VolumeActionsShim";
import {CheckBox} from "@/components/shared/CheckBox";
import {EditButton} from "@/components/shared/EditButton";
import {Pagination} from "@/components/shared/Pagination";
import {SearchBar} from "@/components/shared/SearchBar";
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
import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";

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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [ordinals, setOrdinals] = useState<number[]>([]);
    const pageSize = 2;
    const router = useRouter();
    const [search, setSearch] = useState<string>("");
    const [stories, setStories] = useState<StoryPlus[]>([]);

    // Select the Stories that match the specified filter criteria
    useEffect(() => {

        async function fetchStories() {

            //console.log("StoryItems Parent", JSON.stringify(props.parent));

            // @ts-ignore
            const _model = props.parent["_model"];
            let results: StoryPlus[] = [];
            switch (_model) {

                case "Author":
                    // @ts-ignore
                    results = await AuthorActions.stories(props.parent.libraryId, props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    });
                    break;

                case "Library":
                    results = await StoryActions.all(props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    });
                    break;

                case "Series":
                    // @ts-ignore
                    results = await SeriesActions.stories(props.parent.libraryId, props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    });
                    break;

                case "Volume":
                    // @ts-ignore
                    results = await VolumeActions.stories(props.parent.libraryId, props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    });
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

    }, [active, currentPage, search, props.parent, props.showOrdinal]);

    // No access validation needed, since this is not a page

    /**
     * Add a breadcrumb for this selection, and route to the
     * corresponding href.
     *
     * @param story                     The selected Story
     */
    function onSelect(story: StoryPlus): void {
        const href = `/base/${story.libraryId}/stories/${story.id}`;
        BreadcrumbUtils.add({
            href: href,
            label: story.name,
        });
        router.push(href);
    }

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Stories</CardTitle>
                <CardContent className="p-1">

                    <div className="w-auto py-1">
                        <SearchBar
                            handleChange={(newSearch) => setSearch(newSearch)}
                            placeholder="Story name"
                            value={search}
                        />
                    </div>
                    <div className="flex flex-1 gap-2 py-1">
                        <CheckBox
                            handleValue={(newValue) => setActive(newValue)}
                            label="Active Only?"
                            value={active}
                        />
                        <Pagination
                            currentPage={currentPage}
                            handleNext={() => setCurrentPage(currentPage + 1)}
                            handlePrevious={() => setCurrentPage(currentPage - 1)}
                            lastPage={(stories.length === 0) ||
                                (stories.length < pageSize)}
                            size="xs"
                        />
                    </div>
                    <div className="w-full">
                        <hr/>
                    </div>

                    <Table className="container mx-auto">
{/*
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-auto p-1">Name</TableHead>
                            </TableRow>
                        </TableHeader>
*/}
                        <TableBody>
                            {stories.map((story, index: number) => (
                                <TableRow key={`Story.${story.id}`}>
                                    <TableCell className="p-1">
                                        <span
                                            className="hover:underline"
                                            onClick={() => onSelect(story)}
                                        >
                                            {props.showOrdinal ? (
                                                <span>({ordinals[index]})&nbsp;</span>
                                            ) : null }
                                            {story.name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="p-0">
                                        <EditButton
                                            href={`/stories/${story.libraryId}/${story.id}`}
                                            size="xs"
                                            showLabel={false}
                                        />
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
