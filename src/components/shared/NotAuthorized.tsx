"use client"

// app/components/shared/NotSuperuser.tsx

/**
 * Display a dialog indicating that a user is signed in, but has not been
 * granted authorization to be a superuser.  After "OK" is clicked,
 * redirect the user to the "/select" page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";
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

export default function NotAuthorized() {
    const [open, setOpen] = useState<boolean>(true);
    return (
        <Dialog open={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Not Authorized</DialogTitle>
                    <DialogDescription>
                        You have not been permitted access to this function.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        className="bg-primary-700"
                        onClick={() => {
                            //console.log("Clicked OK in NotAuthorized dialog");
                            setOpen(false);
                            redirect("/select")
                        }}
                    >
                        OK
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

