"use client"

// components/shared/NotSignedIn.tsx

/**
 * Display a dialog indicating that a user who has not signed in attempted
 * to access a function requiring that.  After "Sign In" is clicked, redirect
 * the user to the sign-in page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {signIn} from "next-auth/react";

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

export default function NotSignedIn() {
    return (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Not Signed In</AlertDialogTitle>
                    <AlertDialogDescription>
                        You must be signed in to access this function.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction asChild>
                        <Button
                            onClick={() => {
                                //console.log("Clicked OK in NotSignedIn dialog")
                                signIn();
                            }}
                            variant="primary"
                        >
                            Sign In
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

