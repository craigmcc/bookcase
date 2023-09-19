"use server"

// app/authors/[libraryId]/[authorId]/page.tsx

/**
 * Route for the editing page for Author objects.  Performs authorization
 * checks for the route, and retrieves the Library and Author specified as
 * path parameters, and delegates to AuthorCard for rendering.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import * as AuthorActions from "@/actions/AuthorActionsShim";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import AuthorCard from "@/components/authors/AuthorCard";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotFound from"@/components/shared/NotFound";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {LibraryPlus} from "@/types/models/Library";
import {AuthorPlus} from "@/types/models/Author";
import {authorizedRegular} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function AuthorEditRoute
({params}: {params: {libraryId: string, authorId: string}}) {

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
    let author: AuthorPlus;
    if (Number(params.authorId) < 0) {
        // @ts-ignore (for relations)
        author = {
            id: -1,
            active: true,
            firstName: "",
            lastName: "",
            libraryId: library.id,
            notes: null,
        }
    } else {
        try {
            author = await AuthorActions.find(library.id, Number(params.authorId));
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
            <AuthorCard
                author={author}
                // TODO: back?
                // TODO: destination?
                parent={library}
            />
        </div>
    )

}
