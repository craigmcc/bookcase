// app/api/users/exact/[username]/route.ts

/**
 * API request to return the User whose username matches exactly the
 * specified parameter, or else returns a NotFound error.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {NextResponse} from "next/server";

// Internal Modules ----------------------------------------------------------

import * as UserActions from "@/actions/UserActions";

// Public Objects ------------------------------------------------------------

// @ts-ignore TODO: figure out how to type "params"
export async function GET(request: Request, { params } ) {
    const username = params.username;
    try {
        const user = await UserActions.exact(username);
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({
            context: "/api/users/exact/[username]",
            message: `name: Missing User '${username}'`,
            status: 404,
        }, { status: 404 });
    }
}
