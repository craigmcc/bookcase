"use client"

// components/shared/NotSuperuser.tsx

/**
 * Display a dialog indicating that a user is signed in, but has not been
 * granted authorization to be a superuser.  After "OK" is clicked,
 * redirect the user to the "/select" page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import LinkButton from "@/components/shared/LinkButton";
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
                    <LinkButton
                        className="bg-primary-700 hover:bg-primary-900"
                        href="/select"
                        label="OK"
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
