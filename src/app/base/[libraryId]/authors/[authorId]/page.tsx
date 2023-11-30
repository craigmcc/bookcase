"use server"

// app/base/[libraryId]/authors/[authorId]/page.tsx

/**
 * Base route for performing operations on the specified Author
 * (after authorization checks).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/authOptions";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import * as AuthorActions from "@/actions/AuthorActionsShim";
import AuthorBase from "@/components/authors/AuthorBase";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedRegular} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function AuthorRoute({params}: {params: {libraryId: string, authorId: string}}) {

    // Validate access to this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>
    }
    const library = await LibraryActions.find(Number(params.libraryId));
    if (!authorizedRegular(session.user, library)) {
        return <NotAuthorized/>
    }
    const author = await AuthorActions.find(library.id, Number(params.authorId));
    if (author.libraryId !== library.id) {
        return <NotAuthorized/>
    }

    // Render the requested content
    return (
        <AuthorBase
            author={author}
            library={library}
        />
    )

}
