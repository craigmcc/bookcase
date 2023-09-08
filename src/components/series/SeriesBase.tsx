"use client"

// components/series/SeriesBase.tsx

/**
 * Base page for performing operations on the specified Series
 * (authorization checks assumed to have been completed).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AuthorItems from "@/components/authors/AuthorItems";
import StoryItems from "@/components/stories/StoryItems";
import {LibraryPlus} from "@/types/models/Library";
import {SeriesPlus} from "@/types/models/Series";

// Public Objects ------------------------------------------------------------

type SeriesBaseProps = {
    // Library that owns this Series
    library: LibraryPlus;
    // Series to be managed
    series: SeriesPlus;
}

export default function SeriesBase(props: SeriesBaseProps) {

    // Render the requested content
    return (
        <>
            <div className="container mx-auto py-6">
                <span>Base page for Series <strong>{props.series.name}</strong>&nbsp;
                    in Library <strong>{props.library.name}</strong></span>
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