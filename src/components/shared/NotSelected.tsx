"use client"

// components/shared/NotSelected.tsx

/**
 * Display a dialog indicating that a user has not yet selected a Library
 * to be worked on.  Redirects the user to the "/select" page.
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

export default function NotSSelected() {
    const [open, setOpen] = useState<boolean>(true);
    return (
        <Dialog open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>No Selected Library</DialogTitle>
                    <DialogDescription>
                        You must have selected a Library to use this function.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        className="bg-primary-700"
                        onClick={() => {
                            //console.log("Clicked OK in NotSelected dialog");
                            setOpen(false);
                            redirect("/select");
                        }

                        }
                    >
                        Select Library
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

