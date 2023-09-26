"use client"

// components/volumes/VolumeCard.tsx

/**
 * Wrapper around VolumeForm with a Card presentation.
 *
 * @package Documentation
 */

// External Modules ----------------------------------------------------------

import {usePathname, useSearchParams} from "next/navigation";

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
import {validateHref} from "@/util/ApplicationValidators";
import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";

// Public Objects ------------------------------------------------------------

type VolumeCardProps = {
    // Navigation route for Back button [/base/:libraryId/volumes/:volumeId]
    back?: string,
    // Navigation route after successful save [/base/:libraryId/volumes/:volumeId]
    dest?: string,
    // Parent object for this Volume
    parent: Parent;
    // Volume to be edited (id < 0 means adding)
    volume: VolumePlus,
}

export default function VolumeCard(props: VolumeCardProps) {

    const adding = (props.volume.id < 0);

    // Update breadcrumbs to include this destination (if necessary)
    const pathname = usePathname();
    if (BreadcrumbUtils.has(pathname)) {
        BreadcrumbUtils.trim(pathname);
    } else {
        BreadcrumbUtils.add({
            href: pathname,
            label: props.volume.name,
        });
    }
    console.log("VolumeCard.pathname", pathname);

    // Calculate relevant navigation hrefs
    const searchParams = useSearchParams();
    const back = searchParams.has("back") && validateHref(searchParams.get("back")!)
        ? searchParams.get("back")!
        : `/base/${props.volume.libraryId}/volumes/${props.volume.id}`;
    const dest = searchParams.has("dest") && validateHref(searchParams.get("dest")!)
        ? searchParams.get("dest")!
        : `/base/${props.volume.libraryId}/volumes/${props.volume.id}`;
    console.log("VolumeCard.back", back);
    console.log("VolumeCard.dest", dest);

    // Render the requested content
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
                    dest={dest}
                    parent={props.parent}
                    showHeader={false}
                    volume={props.volume}
                />
            </CardContent>
        </Card>
    )

}
