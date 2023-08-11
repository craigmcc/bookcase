"use client"

// app/libraries/[libraryId]/page.tsx

/**
 * Editing page for Library objects.  Performs authorization checks for
 * the route, and retrieves the Library specified as a path parameter.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Library, Prisma} from "@prisma/client";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {useEffect, useState, useTransition} from "react";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
import LibraryForm from "@/components/libraries/LibraryForm";
import NotSignedIn from "@/components/shared/NotSignedIn";
import NotAuthorized from "@/components/shared/NotAuthorized";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default function LibraryPage({params}: {params: {libraryId: string}}) {

    const router = useRouter();
    const [library, setLibrary] =
        useState<Library | null>(null);
    const [isPending, startTransition] = useTransition();

    // Set up the Library that will be passed to LibraryForm
    useEffect(() => {
        const requestedId = Number(params.libraryId);
        //console.log("LibraryPage.requested", requestedId);
        if (requestedId > 0) {
            startTransition(async () => {
                const result = await LibraryActions.find(requestedId);
                //console.log("LibraryPage.returned", JSON.stringify(result));
                setLibrary(result);
            });
        } else {
            const newLibrary: Library = {
                id: -1,
                active: true,
                name: "",
                notes: null,
                scope: "",

            }
            //console.log("LibraryPage.new", JSON.stringify(newLibrary));
            setLibrary(newLibrary);
        }
    }, [/* params.libraryId */]);

    // Validate access to this function
    const {data: session} = useSession();
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    // Handle the Save action
    const handleSave = async (saved: Library) => {
        //console.log("LibraryPage.saving", JSON.stringify(saved));
        if (saved.id < 0) {
            startTransition(async () => {
                const input: Prisma.LibraryCreateInput = {
                    // Omit id
                    active: saved.active,
                    name: saved.name,
                    notes: saved.notes,
                    scope: saved.scope,
                }
                await LibraryActions.insert(input);
            });
        } else {
            startTransition(async () => {
                const input: Prisma.LibraryUpdateInput = {
                    ...saved,
                }
                await LibraryActions.update(saved.id, input);
            });
        }
        //console.log("LibraryPage.pushing");
        router.push("/libraries");
    }

    //console.log("LibraryPage.rendered", (library) ? JSON.stringify(library) : "SKIPPED");
    return (
        <div className="container mx-auto py-6" suppressHydrationWarning>
            {(library) ? (
                <LibraryForm
                    handleSave={handleSave}
                    library={library}
                />
            ) : (
                <span>Loading Library ...</span>
            )}
        </div>
    )
}
