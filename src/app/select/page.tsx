"use server"

// app/select/page.tsx

/**
 * Route for allowing the user to select which Library they wish to manage,
 * or (for superuser) select an administrative function.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

// Internal Modules ----------------------------------------------------------

import ManageLibrariesCard from "@/components/select/ManageLibrariesCard";
import ManageUsersCard from "@/components/select/ManageUsersCard";
import SelectLibraryCard from "@/components/select/SelectLibraryCard";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

export default async function SelectRoute() {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <NotSignedIn/>
    }
    const isSuperuser = authorizedSuperuser(session.user);

    return (
        <div className="container mx-auto p-6 grid grid-cols-3 gap-4">
            <div className="block h-full p-4">
                <SelectLibraryCard/>
            </div>
            {isSuperuser ? (
                <>
                    <div className="block h-full p-4">
                        <ManageLibrariesCard/>
                    </div>
                    <div className="block h-full p-4">
                        <ManageUsersCard/>
                    </div>
                </>
            ) : null }
        </div>
    )

}

