"use server"

// app/stories/[libraryId]/[storyId]/page.tsx

/**
 * Route for the editing page for Story objects.  Performs authorization
 * checks for the route, and retrieves the Library and Story specified as
 * path parameters, and delegates to StoryCard for rendering.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import * as StoryActions from "@/actions/StoryActionsShim";
import {authOptions} from "@/app/api/auth/[...nextauth]/authOptions";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotFound from"@/components/shared/NotFound";
import NotSignedIn from "@/components/shared/NotSignedIn";
import StoryCard from "@/components/stories/StoryCard";
import {LibraryPlus} from "@/types/models/Library";
import {StoryPlus} from "@/types/models/Story";
import {authorizedRegular} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function StoryEditRoute
({params}: {params: {libraryId: string, storyId: string}}) {

    // Validate access to this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>;
    }
    let library: LibraryPlus;
    try {
        library = await LibraryActions.find(Number(params.libraryId));
    } catch (error) {
        if (error instanceof Error) {
            return <NotFound message={error.message}/>
        } else {
            return <NotFound/>
        }
    }
    if (!authorizedRegular(session.user, library)) {
        return <NotAuthorized/>
    }
    let story: StoryPlus;
    if (Number(params.storyId) < 0) {
        // @ts-ignore (for relations)
        story = {
            id: -1,
            active: true,
            copyright: null,
            libraryId: library.id,
            name: "",
            notes: null,
        }
    } else {
        try {
            story = await StoryActions.find(library.id, Number(params.storyId));
        } catch (error) {
            if (error instanceof Error) {
                return <NotFound message={error.message}/>
            } else {
                return <NotFound/>
            }
        }
    }

    return (
        <div className="container mx-auto py-6" suppressHydrationWarning>
            <StoryCard
                parent={library}
                story={story}
            />
        </div>
    )

}
