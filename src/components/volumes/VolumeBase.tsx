"use client"

// components/volumes/VolumeBase.tsx

/**
 * Base page for performing operations on the specified Volume
 * (authorization checks assumed to have been completed).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AuthorItems from "@/components/authors/AuthorItems";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {Icons} from "@/components/layout/Icons";
import StoryItems from "@/components/stories/StoryItems";
import {LibraryPlus} from "@/types/models/Library";
import {VolumePlus} from "@/types/models/Volume";

// Public Objects ------------------------------------------------------------

type VolumeBaseProps = {
    // Library that owns this Volume
    library: LibraryPlus;
    // Volume to be managed
    volume: VolumePlus;
}

export default function VolumeBase(props: VolumeBaseProps) {

    // Render the requested content
    return (
        <>
            <div className="container pt-4">
                <Breadcrumbs/>
            </div>
            <div className="container flex space-x-2 py-4">
                <Icons.Volume/>
                <span>Base page for Volume <strong>{props.volume.name}</strong>&nbsp;
                    in Library <strong>{props.library.name}</strong></span>
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
