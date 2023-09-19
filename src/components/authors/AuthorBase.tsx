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

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {Icons} from "@/components/layout/Icons";
import SeriesItems from "@/components/series/SeriesItems";
import {EditButton} from "@/components/shared/EditButton";
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
            <div className="container pt-4">
                <Breadcrumbs/>
            </div>
            <div className="container flex flex-row py-4">
                <div className="flex items-center space-x-2">
                    <Icons.Author/>
                    <span>Base page for Author <strong>{props.author.lastName}, {props.author.firstName}</strong>&nbsp;
                        in Library <strong>{props.library.name}</strong></span>
                </div>
                <div className="flex flex-1 justify-end">
                    <EditButton href={`/authors/${props.library.id}/${props.author.id}`}/>
                </div>
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
