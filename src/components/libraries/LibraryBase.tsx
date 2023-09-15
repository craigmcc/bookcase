"use client"

// components/libraries/LibraryBase.tsx

/**
 * Base page for performing operations on the specified Library
 * (authorization checks assumed to have been completed).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AuthorItems from "@/components/authors/AuthorItems";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {Icons} from "@/components/layout/Icons";
import SeriesItems from "@/components/series/SeriesItems";
import StoryItems from "@/components/stories/StoryItems";
import VolumeItems from "@/components/volumes/VolumeItems";
import {LibraryPlus} from "@/types/models/Library";

// Public Objects ------------------------------------------------------------

type LibraryBaseProps = {
    // Library to be managed
    library: LibraryPlus;
}

export default function LibraryBase(props: LibraryBaseProps) {

    // Render the requested content
    return (
        <>
            <div className="container pt-4">
                <Breadcrumbs/>
            </div>
            <div className="container flex space-x-2 py-4">
                <Icons.Library/>
                <span>Base page for Library <strong>{props.library.name}</strong></span>
            </div>
            <div className="container grid grid-cols-4 gap-4">
                <div>
                    <AuthorItems parent={props.library}/>
                </div>
                <div>
                    <SeriesItems parent={props.library}/>
                </div>
                <div>
                    <StoryItems parent={props.library}/>
                </div>
                <div>
                    <VolumeItems parent={props.library}/>
                </div>
            </div>
        </>

    )

}
