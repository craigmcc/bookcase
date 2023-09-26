"use server"

// app/volumes/[libraryId]/[volumeId]/page.tsx

/**
 * Route for the editing page for Volume objects.  Performs authorization
 * checks for the route, and retrieves the Library and Volume specified as
 * path parameters, and delegates to VolumeCard for rendering.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import * as VolumeActions from "@/actions/VolumeActionsShim";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotFound from"@/components/shared/NotFound";
import NotSignedIn from "@/components/shared/NotSignedIn";
import VolumeCard from "@/components/volumes/VolumeCard";
import {LibraryPlus} from "@/types/models/Library";
import {VolumePlus} from "@/types/models/Volume";
import {authorizedRegular} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function VolumeEditRoute
    ({params}: {params: {libraryId: string, volumeId: string}}) {

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
    let volume: VolumePlus;
    if (Number(params.volumeId) < 0) {
        // @ts-ignore (for relations)
        volume = {
            id: -1,
            active: true,
            copyright: null,
            googleId: null,
            isbn: null,
            libraryId: library.id,
            location: "Kindle",
            name: "",
            notes: null,
            read: false,
            type: "Single",
        }
    } else {
        try {
            volume = await VolumeActions.find(library.id, Number(params.volumeId));
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
            <VolumeCard
                parent={library}
                volume={volume}
            />
        </div>
    )

}
