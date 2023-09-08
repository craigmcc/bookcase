"use client"

// components/stories/StoryBase.tsx

/**
 * Base page for performing operations on the specified Story
 * (authorization checks assumed to have been completed).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AuthorItems from "@/components/authors/AuthorItems";
import SeriesItems from "@/components/series/SeriesItems";
import VolumeItems from "@/components/volumes/VolumeItems";
import {LibraryPlus} from "@/types/models/Library";
import {StoryPlus} from "@/types/models/Story";

// Public Objects ------------------------------------------------------------

type StoryBaseProps = {
    // Library that owns this Story
    library: LibraryPlus;
    // Story to be managed
    story: StoryPlus;
}

export default function StoryBase(props: StoryBaseProps) {

    // Render the requested content
    return (
        <>
            <div className="container mx-auto py-6">
                <span>Base page for Story <strong>{props.story.name}</strong>&nbsp;
                    in Library <strong>{props.library.name}</strong></span>
            </div>
            <div className="container grid grid-cols-3 gap-4">
                <div>
                    <AuthorItems parent={props.story}/>
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
