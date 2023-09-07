"use server"

// app/users/[userId]/page.tsx

/**
 * Route for the editing page for User objects.  Performs authorization checks
 * for the route, and retrieves the User specified as a path parameter.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {User} from "@prisma/client";
import {getServerSession} from "next-auth/next";

// Internal Modules ----------------------------------------------------------

import * as UserActions from "@/actions/UserActionsShim";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import UserCard from "@/components/users/UserCard";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotFound from "@/components/shared/NotFound";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function UserRoute({params}: {params: {userId: string}}) {

    // Validate access to this page
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    // Retrieve the requested User or create a template for a new one
    const userId = Number(params.userId);
    let user: User;
    if (userId < 0) {
        user = {
            id: -1,
            active: true,
            google_books_api_key: "",
            name: "",
            password: "",
            scope: "",
            username: "",
        }
    } else {
        try {
            user = await UserActions.find(userId);
        } catch (error) {
            if (error instanceof Error) {
                return <NotFound message={error.message}/>
            } else {
                return <NotFound/>
            }
        }
    }

    //console.log("UserPage.rendered", JSON.stringify(user));
    return (
        <div className="container mx-auto py-6" suppressHydrationWarning>
            <UserCard
                user={user}
            />
        </div>
    )
}
