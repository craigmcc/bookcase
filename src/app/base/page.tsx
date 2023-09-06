"use client"

// app/libraries/base.tsx

/**
 * Base route for performing operations on the selected (and therefore
 * authorized) Library:  managing Authors, Series, Stories, and Volumes.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useSession} from "next-auth/react";
import {useContext} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorItems from "@/components/authors/AuthorItems";
import {LibraryContext} from "@/components/layout/LibraryContext";
import SeriesItems from "@/components/series/SeriesItems";
import NotSelected from "@/components/shared/NotSelected";
import NotSignedIn from "@/components/shared/NotSignedIn";
import StoryItems from "@/components/stories/StoryItems";
import VolumeItems from "@/components/volumes/VolumeItems"


// Public Objects ------------------------------------------------------------

export default function BasePage() {

    const libraryContext = useContext(LibraryContext);
    const {data: session} = useSession();

    // Validate access to this function
    if (!session || !session.user) {
        return <NotSignedIn/>
    }
    else if (!libraryContext.library) {
        return <NotSelected/>
    }

    // Render the requested content
    return (
        <>
            <div className="container mx-auto py-6">
                <span>Base page for Library <strong>{libraryContext.library.name}</strong></span>
            </div>
            <div className="container grid grid-cols-4 gap-4">
                <div>
                    <AuthorItems parent={libraryContext.library}/>
                </div>
                <div>
                    <SeriesItems library={libraryContext.library}/>
                </div>
                <div>
                    <StoryItems parent={libraryContext.library}/>
                </div>
                <div>
                    <VolumeItems library={libraryContext.library}/>
                </div>
            </div>
        </>
    )

}
