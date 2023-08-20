"use server"

// app/users/[userId]/page.tsx

/**
 * Editing page for User objects.  Performs authorization checks for
 * the route, and retrieves the User specified as a path parameter.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {User, Prisma} from "@prisma/client";
import {getServerSession} from "next-auth/next";

// Internal Modules ----------------------------------------------------------

import * as UserActions from "@/actions/UserActionsShim";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import UserForm from "@/components/users/UserForm";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotFound from "@/components/shared/NotFound";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function UserPage({params}: {params: {userId: string}}) {

    // Validate access to this page
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    // Retrieve the requested User or create a template for a new User
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

    // Handle an Insert action
/*
    const handleInsert = async (saved: User) => {
        "use server"
        const input: Prisma.UserCreateInput = {
            // Omit id
            active: saved.active,
            google_books_api_key: saved.google_books_api_key,
            name: saved.name,
            password: saved.password,
            scope: saved.scope,
            username: saved.username,
        }
        try {
            // TODO - depends on caller to navigate (LAME!)
            await UserActions.insert(input);
        } catch (error) {
            // TODO: - something more graceful would be better
            alert("ERROR ON INSERT: " + JSON.stringify(error));
        }
    }
*/

    // Handle an Update action
/*
    const handleUpdate = async (saved: User) => {
        "use server"
        const input: Prisma.UserUpdateInput = {
            ...saved,
        }
        try {
            // TODO - depends on caller to navigate (LAME!)
            await UserActions.update(saved.id, input);
        } catch (error) {
            // TODO: - something more graceful would be better
            alert("ERROR ON UPDATE: " + JSON.stringify(error));
        }
    }
*/

    //console.log("UserPage.rendered", JSON.stringify(user));
    return (
        <div className="container mx-auto py-6" suppressHydrationWarning>
            <UserForm
                destination="/users"
//                handleInsert={handleInsert}
//                handleUpdate={handleUpdate}
                user={user}
            />
        </div>
    )
}
