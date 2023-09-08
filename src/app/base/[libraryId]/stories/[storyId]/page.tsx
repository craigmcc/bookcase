"use server"

// app/base/[libraryId]/stories/[storyId]/page.tsx

/**
 * Base route for performing operations on the specified Story
 * (after authorization checks).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import * as StoryActions from "@/actions/StoryActionsShim";
import StoryBase from "@/components/stories/StoryBase";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedRegular} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function StoryRoute({params}: {params: {libraryId: string, storyId: string}}) {

    // Validate access to this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>
    }
    const library = await LibraryActions.find(Number(params.libraryId));
    if (!authorizedRegular(session.user, library)) {
        return <NotAuthorized/>
    }
    const story = await StoryActions.find(library.id, Number(params.storyId));
    if (story.libraryId !== library.id) {
        return <NotAuthorized/>
    }

    // Render the requested content
    return (
        <StoryBase
            library={library}
            story={story}
        />
    )

}
