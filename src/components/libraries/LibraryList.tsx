"use client"

// components/libraries/LibraryList.tsx

/**
 * React component containing the list of Libraries for the "/libraries" page.
 * This needs to be a client component so that it is not async, and can
 * therefore use the useSession() hook from next-auth.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

// Internal Modules ----------------------------------------------------------

import {LibraryListColumns} from "./LibraryListColumns";
import * as LibraryActions from "@/actions/LibraryActions";
import {Button} from "@/components/my/Button";
import {DataTable} from "@/components/shared/DataTable";
import NotAuthorized from "@/components/shared/NotAuthorized";
import NotSignedIn from "@/components/shared/NotSignedIn";
import {Icons} from "@/components/layout/Icons";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {authorizedSuperuser} from "@/util/Authorizations";

// Public Objects ------------------------------------------------------------

type LibraryListProps = {
    // Array of Libraries to be presented
    libraries: LibraryActions.LibraryPlus[],
}

export default function LibraryList(props: LibraryListProps) {

    const router = useRouter();

    // Validate access to this function
    const {data: session} = useSession();
    if (!session || !session.user) {
        return <NotSignedIn/>;
    } else if (!authorizedSuperuser(session.user)) {
        return <NotAuthorized/>;
    }

    // Render the requested content
    return (
        <>
            <div className="grid grid-cols-3">
                <div className="text-left">
                    <Button
                        onClick={() => router.push("/select")}
                        variant="secondary"
                    >
                        <Icons.Back className="mr2"/>
                        Back
                    </Button>
                </div>
                <div className="text-center items-center">
                    <strong>Manage Libraries</strong>
                </div>
                <div className="text-right">
                    <Button
                        onClick={() => router.push("/libraries/-1")}
                    >
                        <Icons.Add className="mr-2"/>
                        Add
                    </Button>
                </div>
            </div>

            <div className="container mx-auto py-6">
                {/*<DataTable columns={LibraryListColumns} data={props.libraries}/>*/}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Scope</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.libraries.map((library, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {library.name}
                                </TableCell>
                                <TableCell>
                                    {library.active ? (
                                        <Icons.Check color="green"/>
                                    ) : (
                                        <Icons.Uncheck color="red"/>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {library.notes}
                                </TableCell>
                                <TableCell>
                                    {library.scope}
                                </TableCell>
                                <TableCell>
                                    <Link href={`/libraries/${library.id}`}>
                                        <Button
                                            variant="success"
                                        >
                                            <Icons.Edit className="mr-2"/>
                                            Edit
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}