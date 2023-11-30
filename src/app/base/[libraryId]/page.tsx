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
import {authOptions} from "@/app/api/auth/[...nextauth]/authOptions";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import LibraryBase from "@/components/libraries/LibraryBase";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedRegular} from "@/util/Authorizations";


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
        <LibraryBase library={library}/>
    )

}
