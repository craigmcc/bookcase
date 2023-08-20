"use client"

// components/shared/NotFound.tsx

/**
 * Display a dialog indicating that the information being requested was not found.
 * Redirects the user to the "/" page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Public Objects ------------------------------------------------------------

export type NotFoundProps = {
    // Optional message to be displayed [generic "not found" message]
    message?: string;
}

export default function NotFound(props: NotFoundProps) {
    return (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Requested Information Not Found</AlertDialogTitle>
                    <AlertDialogDescription>
                        {props.message ? (
                            <p>{props.message}</p>
                        ) : (
                            <p>The information you have requested cannot be found.</p>
                        )}
                        <p>Check the URL that you used to access this page.</p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction asChild>
                        <Link href="/">
                            OK
                        </Link>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
