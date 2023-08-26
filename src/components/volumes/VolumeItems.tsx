"use client"

// components/volumes/VolumeItems.tsx

/**
 * Abbreviated list of Volumes that relate to a particular type of parent
 * object, and provides various actions to trigger related UX activities.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState, useTransition} from "react";
import {Library} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

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
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {VolumeAllOptions, VolumePlus} from "@/types/models/Volume";
//import {HandleBoolean, HandleString} from "@/types/types";

// Public Objects ------------------------------------------------------------

type VolumeItemsProps = {
    // Library for which to retrieve Volumes
    library: Library;
    // TODO - will need other parent types in the future
    // TODO - will need navigation actions?
}

export default function VolumeItems(props: VolumeItemsProps) {

    const [active, setActive] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [volumes, setVolumes] = useState<VolumePlus[]>([]);
    const [isPending, startTransition] = useTransition();

    // Select the Volumes that match the specified filter criteria
    useEffect(() => {

/*
        async function fetchVolumes() {
            const options: VolumeAllOptions = {
                active: (active) ? true : undefined,
                name: (search.length > 0) ? search : undefined,
            }
            const results = await VolumeActions.all(props.library.id, options);
            setVolumes(results);
        }

        fetchVolumes();
*/
        startTransition(async () => {
            const options: VolumeAllOptions = {
                active: (active) ? true : undefined,
                name: (search.length > 0) ? search : undefined,
            }
            const results = await VolumeActions.all(props.library.id, options);
            setVolumes(results);
        });

    }, [active, search]);

    // No access validation needed, since this is not a page

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Volumes</CardTitle>
                <CardContent>
                    <Table className="container mx-auto">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {volumes.map((volume, index) => (
                                <TableRow key={index}>
                                    <TableCell>
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