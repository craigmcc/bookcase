"use client"

// app/components/shared/NotSignedIn.tsx

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

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Public Objects ------------------------------------------------------------

export default function NotSignedIn() {
    return (
        <Dialog open={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Not Signed In</DialogTitle>
                    <DialogDescription>
                        You must be signed in to access this function.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        className="bg-primary-700"
                        onClick={() => signIn()}
                    >
                        Sign In
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

