"use server"

// components/select/SelectLibraryCard.tsx

/**
 * Card for the /select page to choose which Library the user
 * wants to interact with.
 *
 * ASSUMPTION:  Parent page has validated user has signed in.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Image from 'next/image'
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

// Internal Modules ----------------------------------------------------------

import SelectLibraryForm from "./SelectLibraryForm";
import * as LibraryActions from "@/actions/LibraryActions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {authorizedRegular} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function SelectLibraryCard() {

    const session = await getServerSession(authOptions);

    /**
     * Return a list of Libraries for which this user is authorized
     * to select one of them.
     */
    async function filterLibraries(): Promise<LibraryActions.LibraryPlus[]> {
        if (!session || !session.user) {
            return [];
        }
        const results: LibraryActions.LibraryPlus[] = [];
        const libraries = await LibraryActions.all();
        for (const library of libraries) {
            if (authorizedRegular(session.user, library)) {
                results.push(library);
            }
        }
        return results;
    }
    const libraries: LibraryActions.LibraryPlus[] = await filterLibraries();

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Select A Library</CardTitle>
                <CardDescription>
                    Select the Library whose contents you wish to review and/or edit.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-2 ml-3.5 w-full">
                    <Image
                        alt="Library"
                        height={300}
                        src="/images/library.jpg"
                        width={300}
                    />
                </div>
                <div>
                    <SelectLibraryForm libraries={libraries}/>
                </div>
            </CardContent>
        </Card>
    )

}
