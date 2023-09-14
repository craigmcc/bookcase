"use client"

// components/volumes/VolumeItems.tsx

/**
 * Abbreviated list of Volumes that relate to a particular type of parent
 * object, and provides various actions to trigger related UX activities.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "@/actions/AuthorActionsShim";
import * as StoryActions from "@/actions/StoryActionsShim";
import * as VolumeActions from "@/actions/VolumeActionsShim";
import {CheckBox} from "@/components/shared/CheckBox";
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
import {StoryPlus} from "@/types/models/Story";
import {VolumePlus} from "@/types/models/Volume";
//import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type VolumeItemsProps = {
    // Parent model for which to retrieve Volumes
    parent: AuthorPlus | LibraryPlus | StoryPlus;
    // TODO - will need navigation actions?
}

export default function VolumeItems(props: VolumeItemsProps) {

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 2;
    const [search, setSearch] = useState<string>("");
    const [volumes, setVolumes] = useState<VolumePlus[]>([]);

    // Select the Volumes that match the specified filter criteria
    useEffect(() => {

        async function fetchVolumes() {

            //console.log("VolumeItems Parent", JSON.stringify(props.parent));

            // @ts-ignore
            const _model = props.parent["_model"];
            switch (_model) {

                case "Author":
                    // @ts-ignore
                    setVolumes(await AuthorActions.volumes(props.parent.libraryId, props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        offset: (pageSize * (currentPage - 1)),
                        name: (search.length > 0) ? search : undefined,
                    }));
                    break;

                case "Library":
                    setVolumes(await VolumeActions.all(props.parent.id, {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        name: (search.length > 0) ? search : undefined,
                        offset: (pageSize * (currentPage - 1)),
                    }));
                    break;

                case "Story":
                    // @ts-ignore
                    setVolumes(await StoryActions.volumes(props.parent.libraryId, props.parent.id), {
                        active: (active) ? true : undefined,
                        limit: pageSize,
                        offset: (pageSize * (currentPage - 1)),
                        name: (search.length > 0) ? search : undefined,
                    });
                    break;

                default:
                    alert(`VolumeItems: Unsupported parent model ${_model}`);
                    setVolumes([]);
                    break;

            }

        }

        fetchVolumes();

    }, [active, currentPage, search, props.parent]);

    // No access validation needed, since this is not a page

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Volumes</CardTitle>
                <CardContent className="p-1">

                    <div className="w-auto py-1">
                        <SearchBar
                            handleChange={(newSearch) => setSearch(newSearch)}
                            placeholder="Volume name"
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
                            lastPage={(volumes.length === 0) ||
                                (volumes.length < pageSize)}
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
                            {volumes.map((volume, index) => (
                                <TableRow key={index}>
                                    <TableCell className="p-1">
                                        {volume.name}
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
