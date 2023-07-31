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
import {useState} from "react";

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
    const [open, setOpen] = useState<boolean>(true);
    return (
        <Dialog open={open}>
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
                        onClick={() => {
                            //console.log("Clicked OK in NotSignedIn dialog
                            setOpen(false);
                            signIn();
                        }}
                    >
                        Sign In
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

