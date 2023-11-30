"use server"

// app/libraries/[libraryId]/page.tsx

/**
 * Route for the editing page for Library objects.  Performs authorization
 * checks for the route, and retrieves the Library specified as a path
 * parameter, and delegates to LibraryCard for rendering.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import {authOptions} from "@/app/api/auth/[...nextauth]/authOptions";
import LibraryCard from "@/components/libraries/LibraryCard";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotFound from"@/components/shared/NotFound";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {LibraryPlus} from "@/types/models/Library";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function LibraryRoute({params}: {params: {libraryId: string}}) {

    // Validate access to this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    // Retrieve the requested Library or create a template for a new one
    const libraryId = Number(params.libraryId);
    let library: LibraryPlus;
    if (libraryId < 0) {
        // @ts-ignore
        library = {
            id: -1,
            active: true,
            name: "",
            notes: "",
            scope: "",
        }
    } else {
        try {
            library = await LibraryActions.find(libraryId);
        } catch (error) {
            if (error instanceof Error) {
                return <NotFound message={error.message}/>
            } else {
                return <NotFound/>
            }
        }
    }

    //console.log("LibraryPage.rendered", JSON.stringify(library));
    return (
        <div className="container mx-auto py-6" suppressHydrationWarning>
            <LibraryCard
                library={library}
            />
        </div>
    )
}
