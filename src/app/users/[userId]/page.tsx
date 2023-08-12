"use client"

// app/users/[userId]/page.tsx

/**
 * Editing page for User objects.  Performs authorization checks for
 * the route, and retrieves the User specified as a path parameter.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {User, Prisma} from "@prisma/client";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {useEffect, useState, useTransition} from "react";

// Internal Modules ----------------------------------------------------------

import * as UserActions from "@/actions/UserActionsShim";
import UserForm from "@/components/users/UserForm";
import NotSignedIn from "@/components/shared/NotSignedIn";
import NotAuthorized from "@/components/shared/NotAuthorized";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default function UserPage({params}: {params: {userId: string}}) {

    const router = useRouter();
    const [user, setUser] =
        useState<User | null>(null);
    const [isPending, startTransition] = useTransition();

    // Set up the User that will be passed to UserForm
    useEffect(() => {
        const requestedId = Number(params.userId);
        //console.log("UserPage.requested", requestedId);
        if (requestedId > 0) {
            startTransition(async () => {
                const result = await UserActions.find(requestedId);
                //console.log("UserPage.returned", JSON.stringify(result));
                setUser(result);
            });
        } else {
            const newUser: User = {
                id: -1,
                active: true,
                google_books_api_key: "",
                name: "",
                password: "",
                scope: "",
                username: "",

            }
            //console.log("UserPage.new", JSON.stringify(newUser));
            setUser(newUser);
        }
    }, [params.userId]);

    // Validate access to this function
    const {data: session} = useSession();
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    // Handle the Save action
    const handleSave = async (saved: User) => {
        //console.log("UserPage.saving", JSON.stringify(saved));
        if (saved.id < 0) {
            startTransition(async () => {
                const input: Prisma.UserCreateInput = {
                    // Omit id
                    active: saved.active,
                    google_books_api_key: saved.google_books_api_key,
                    name: saved.name,
                    password: saved.password,
                    scope: saved.scope,
                    username: saved.username,
                }
                await UserActions.insert(input);
            });
        } else {
            startTransition(async () => {
                const input: Prisma.UserUpdateInput = {
                    ...saved,
                }
                await UserActions.update(saved.id, input);
            });
        }
        //console.log("UserPage.pushing");
        router.push("/users");
    }

    //console.log("UserPage.rendered", (user) ? JSON.stringify(user) : "SKIPPED");
    return (
        <div className="container mx-auto py-6" suppressHydrationWarning>
            {(user) ? (
                <UserForm
                    handleSave={handleSave}
                    user={user}
                />
            ) : (
                <span>Loading User ...</span>
            )}
        </div>
    )
}
