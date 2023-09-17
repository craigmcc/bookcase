"use client"

// components/volumes/VolumeCard.tsx

/**
 * Wrapper around VolumeForm with a Card presentation.
 *
 * @package Documentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import VolumeForm from "./VolumeForm";
import VolumeHeader from "./VolumeHeader";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {VolumePlus} from "@/types/models/Volume";
import {Parent} from "@/types/types";

// Public Objects ------------------------------------------------------------

type VolumeCardProps = {
    // Navigation destination for Back button [/base/:libraryId/volumes/:volumeId]
    back?: string,
    // Navigation destination after successful save [/base/:libraryId/volumes/:volumeId]
    destination?: string,
    // Parent object for this Volume
    parent: Parent;
    // Volume to be edited (id < 0 means adding)
    volume: VolumePlus,
}

export default function VolumeCard(props: VolumeCardProps) {

    const adding = (props.volume.id < 0);
    const back = props.back ? props.back
        : `/base/${props.volume.libraryId}/volumes/${props.volume.id}`;
    const destination = props.destination ? props.destination
        : `/base/${props.volume.libraryId}/volumes/${props.volume.id}`;

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>
                    <VolumeHeader
                        adding={adding}
                        back={back}
                        parent={props.parent}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <VolumeForm
                    destination={destination}
                    parent={props.parent}
                    showHeader={false}
                    volume={props.volume}
                />
            </CardContent>
        </Card>
    )

}
