"use client"

// components/volumes/VolumeBase.tsx

/**
 * Base page for performing operations on the specified Volume
 * (authorization checks assumed to have been completed).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {usePathname} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import AuthorItems from "@/components/authors/AuthorItems";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {Icons} from "@/components/layout/Icons";
import {EditButton} from "@/components/shared/EditButton";
import StoryItems from "@/components/stories/StoryItems";
import {LibraryPlus} from "@/types/models/Library";
import {VolumePlus} from "@/types/models/Volume";
import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";

// Public Objects ------------------------------------------------------------

type VolumeBaseProps = {
    // Library that owns this Volume
    library: LibraryPlus;
    // Volume to be managed
    volume: VolumePlus;
}

export default function VolumeBase(props: VolumeBaseProps) {

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
    console.log("VolumeBase.pathname", pathname);

    // Calculate relevant navigation hrefs
    const back = pathname;
    const dest = pathname;
    const edit =
        `/volumes/${props.library.id}/${props.volume.id}?back=${back}&dest=${dest}`;
    console.log("VolumeBase.edit", edit);

    // Render the requested content
    return (
        <>
            <div className="container pt-4">
                <Breadcrumbs/>
            </div>
            <div className="container flex flex-row py-4">
                <div className="flex items-center space-x-2">
                    <Icons.Volume/>
                    <span>Base page for Volume <strong>{props.volume.name}</strong>&nbsp;
                        in Library <strong>{props.library.name}</strong></span>
                </div>
                <div className="flex flex-1 justify-end">
                    <EditButton href={edit}/>
                </div>
            </div>
            <div className="container grid grid-cols-2 gap-4">
                <div>
                    <AuthorItems parent={props.volume} showPrincipal={true}/>
                </div>
                <div>
                    <StoryItems parent={props.volume}/>
                </div>
            </div>
        </>
    )

}
