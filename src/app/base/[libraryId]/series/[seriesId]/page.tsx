"use server"

// app/base/[libraryId]/series/[seriesId]/page.tsx

/**
 * Base route for performing operations on the specified Series
 * (after authorization checks).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/authOptions";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import * as SeriesActions from "@/actions/SeriesActionsShim";
import SeriesBase from "@/components/series/SeriesBase";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedRegular} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function SeriesRoute({params}: {params: {libraryId: string, seriesId: string}}) {

    // Validate access to this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>
    }
    const library = await LibraryActions.find(Number(params.libraryId));
    if (!authorizedRegular(session.user, library)) {
        return <NotAuthorized/>
    }
    const series = await SeriesActions.find(library.id, Number(params.seriesId));
    if (series.libraryId !== library.id) {
        return <NotAuthorized/>
    }

    // Render the requested content
    return (
        <SeriesBase
            library={library}
            series={series}
        />
    )

}
