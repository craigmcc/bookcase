"use client"

// components/authors/AuthorBase.tsx

/**
 * Base page for performing operations on the specified Author
 * (authorization checks assumed to have been completed).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import SeriesItems from "@/components/series/SeriesItems";
import StoryItems from "@/components/stories/StoryItems";
import VolumeItems from "@/components/volumes/VolumeItems";
import {AuthorPlus} from "@/types/models/Author";
import {LibraryPlus} from "@/types/models/Library";

// Public Objects ------------------------------------------------------------

type AuthorBaseProps = {
    // Author to be managed
    author: AuthorPlus;
    // Library that owns this Author
    library: LibraryPlus;
}

export default function AuthorBase(props: AuthorBaseProps) {

    // Render the requested content
    return (
        <>
            <div className="container flex space-x-2 py-4">
                <Icons.Author/>
                <span>Base page for Author <strong>{props.author.lastName}, {props.author.firstName}</strong>&nbsp;
                    in Library <strong>{props.library.name}</strong></span>
            </div>
            <div className="container grid grid-cols-3 gap-4">
                <div>
                    <SeriesItems parent={props.author}/>
                </div>
                <div>
                    <StoryItems parent={props.author}/>
                </div>
                <div>
                    <VolumeItems parent={props.author}/>
                </div>
            </div>
        </>
    )

}
