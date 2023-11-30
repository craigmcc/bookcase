"use server"

// app/base/[libraryId]/volumes/[volumeId]/page.tsx

/**
 * Base route for performing operations on the specified Volume
 * (after authorization checks).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/authOptions";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import * as VolumeActions from "@/actions/VolumeActionsShim";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import VolumeBase from "@/components/volumes/VolumeBase";
import {authorizedRegular} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function VolumeRoute({params}: {params: {libraryId: string, volumeId: string}}) {

    // Validate access to this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>
    }
    const library = await LibraryActions.find(Number(params.libraryId));
    if (!authorizedRegular(session.user, library)) {
        return <NotAuthorized/>
    }
    const volume = await VolumeActions.find(library.id, Number(params.volumeId));
    if (volume.libraryId !== library.id) {
        return <NotAuthorized/>
    }

    // Render the requested content
    return (
        <VolumeBase
            library={library}
            volume={volume}
        />
    )

}
