"use server"

// app/series/[libraryId]/[seriesId]/page.tsx

/**
 * Route for the editing page for Series objects.  Performs authorization
 * checks for the route, and retrieves the Library and Series specified as
 * path parameters, and delegates to SeriesCard for rendering.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import * as SeriesActions from "@/actions/SeriesActionsShim";
import {authOptions} from "@/app/api/auth/[...nextauth]/authOptions";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotFound from"@/components/shared/NotFound";
import NotSignedIn from "@/components/shared/NotSignedIn";
import SeriesCard from "@/components/series/SeriesCard";
import {LibraryPlus} from "@/types/models/Library";
import {SeriesPlus} from "@/types/models/Series";
import {authorizedRegular} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function SeriesEditRoute
({params}: {params: {libraryId: string, seriesId: string}}) {

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
    let series: SeriesPlus;
    if (Number(params.seriesId) < 0) {
        // @ts-ignore (for relations)
        series = {
            id: -1,
            active: true,
            copyright: null,
            libraryId: library.id,
            name: "",
            notes: null,
        }
    } else {
        try {
            series = await SeriesActions.find(library.id, Number(params.seriesId));
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
            <SeriesCard
                parent={library}
                series={series}
            />
        </div>
    )

}
