"use client"

// components/shared/NotAuthorized.tsx

/**
 * Display a dialog indicating that a user is signed in, but has not been
 * granted authorization to perform this function.  After "OK" is clicked,
 * redirect the user to the "/select" page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import {Button} from "@/components/my/Button";
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

export default function NotAuthorized() {
    return (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Not Authorized</AlertDialogTitle>
                    <AlertDialogDescription>
                        You have not been permitted access to this function.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction asChild>
                        <Link href="/select">
                            <Button variant="primary">
                                OK
                            </Button>
                        </Link>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
