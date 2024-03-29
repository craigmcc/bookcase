"use client"

// components/stories/StoryBase.tsx

/**
 * Base page for performing operations on the specified Story
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
import SeriesItems from "@/components/series/SeriesItems";
import {EditButton} from "@/components/shared/EditButton";
import VolumeItems from "@/components/volumes/VolumeItems";
import {LibraryPlus} from "@/types/models/Library";
import {StoryPlus} from "@/types/models/Story";
import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";

// Public Objects ------------------------------------------------------------

type StoryBaseProps = {
    // Library that owns this Story
    library: LibraryPlus;
    // Story to be managed
    story: StoryPlus;
}

export default function StoryBase(props: StoryBaseProps) {

    // Update breadcrumbs to include this destination (if necessary)
    const pathname = usePathname();
    if (BreadcrumbUtils.has(pathname)) {
        BreadcrumbUtils.trim(pathname);
    } else {
        BreadcrumbUtils.add({
            href: pathname,
            label: props.story.name,
        });
    }
    console.log("StoryBase.pathname", pathname);

    // Calculate relevant navigation hrefs
    const back = pathname;
    const dest = pathname;
    const edit =
        `/stories/${props.library.id}/${props.story.id}?back=${back}&dest=${dest}`;
    console.log("StoryBase.edit", edit);

    // Render the requested content
    return (
        <>
            <div className="container pt-4">
                <Breadcrumbs/>
            </div>
            <div className="container flex flex-row py-4">
                <div className="flex items-center space-x-2">
                    <Icons.Story/>
                    <span>Base page for Story <strong>{props.story.name}</strong>&nbsp;
                        in Library <strong>{props.library.name}</strong></span>
                </div>
                <div className="flex flex-1 justify-end">
                    <EditButton href={edit}/>
                </div>
            </div>
            <div className="container grid grid-cols-3 gap-4">
                <div>
                    <AuthorItems parent={props.story} showPrincipal={true}/>
                </div>
                <div>
                    <SeriesItems parent={props.story}/>
                </div>
                <div>
                    <VolumeItems parent={props.story}/>
                </div>
            </div>
        </>
    )

}
