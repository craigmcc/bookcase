// app/api/libraries/exact/[name]/route.ts

/**
 * API request to return the Library whose name matches exactly the
 * specified parameter, or else returns a NotFound error.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {NextResponse} from "next/server";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActions";

// Public Objects ------------------------------------------------------------

// @ts-ignore TODO: figure out how to type "params"
export async function GET(request: Request, { params } ) {
    const name = params.name; // TODO - extract from path parameter
    try {
        const library = await LibraryActions.exact(name);
        return NextResponse.json(library);
    } catch (error) {
        return NextResponse.json({
            context: "/api/libraries/exact/[name]",
            message: `name: Missing Library '${name}'`,
            status: 404,
        }, { status: 404 });
    }
}
