"use server"

// app/base/[libraryId]/page.tsx

/**
 * Base route for performing operations on the specified Library
 * (after authorization checks).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

// Internal Modules ----------------------------------------------------------

import AuthorItems from "@/components/authors/AuthorItems";
import {Icons} from "@/components/layout/Icons";
import SeriesItems from "@/components/series/SeriesItems";
import NotSignedIn from "@/components/shared/NotSignedIn";
import StoryItems from "@/components/stories/StoryItems";
import VolumeItems from "@/components/volumes/VolumeItems"
import * as LibraryActions from "@/actions/LibraryActionsShim";
import {authorizedRegular} from "@/util/Authorizations";
import NotAuthorized from "@/components/shared/NotAuthorized";


// Public Objects ------------------------------------------------------------

export default async function BaseRoute({params}: {params: {libraryId: string}}) {

    // Validate access to this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>;
    }
    const library = await LibraryActions.find(Number(params.libraryId));
    if (!authorizedRegular(session.user, library)) {
        return <NotAuthorized/>
    }

    // Render the requested content
    return (
        <>
            <div className="container flex space-x-2 py-4">
                <Icons.Library/>
                <span>Base page for Library <strong>{library.name}</strong></span>
            </div>
            <div className="container grid grid-cols-4 gap-4">
                <div>
                    <AuthorItems parent={library}/>
                </div>
                <div>
                    <SeriesItems parent={library}/>
                </div>
                <div>
                    <StoryItems parent={library}/>
                </div>
                <div>
                    <VolumeItems parent={library}/>
                </div>
            </div>
        </>
    )

}
