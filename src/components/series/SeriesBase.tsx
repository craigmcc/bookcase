"use client"

// components/series/SeriesBase.tsx

/**
 * Base page for performing operations on the specified Series
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
import {SeriesPlus} from "@/types/models/Series";
import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";

// Public Objects ------------------------------------------------------------

type SeriesBaseProps = {
    // Library that owns this Series
    library: LibraryPlus;
    // Series to be managed
    series: SeriesPlus;
}

export default function SeriesBase(props: SeriesBaseProps) {

    // Update breadcrumbs to include this destination (if necessary)
    const pathname = usePathname();
    if (BreadcrumbUtils.has(pathname)) {
        BreadcrumbUtils.trim(pathname);
    } else {
        BreadcrumbUtils.add({
            href: pathname,
            label: props.series.name,
        });
    }
    console.log("SeriesBase.pathname", pathname);

    // Calculate relevant navigation hrefs
    const back = pathname;
    const dest = pathname;
    const edit =
        `/series/${props.library.id}/${props.series.id}?back=${back}&dest=${dest}`;
    console.log("SeriesBase.edit", edit);

    // Render the requested content
    return (
        <>
            <div className="container pt-4">
                <Breadcrumbs/>
            </div>
            <div className="container flex flex-row py-4">
                <div className="flex items-center space-x-2">
                    <Icons.Series/>
                    <span>Base page for Series <strong>{props.series.name}</strong>&nbsp;
                        in Library <strong>{props.library.name}</strong></span>
                </div>
                <div className="flex flex-1 justify-end">
                    <EditButton href={edit}/>
                </div>
            </div>
            <div className="container grid grid-cols-2 gap-4">
                <div>
                    <AuthorItems parent={props.series} showPrincipal={true}/>
                </div>
                <div>
                    <StoryItems parent={props.series} showOrdinal={true}/>
                </div>
            </div>
        </>
    )

}
