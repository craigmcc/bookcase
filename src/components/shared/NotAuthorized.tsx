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

import Link from "next/link";

// Internal Modules ----------------------------------------------------------

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
                    <Link
                        // className="bg-primary-700 text-white rounded"
                        className="inline-flex items-center justify-center rounded
                          text-sm font-medium ring-offset-white transition-colors
                          focus-visible:outline-none focus-visible:ring-2
                          focus-visible:ring-slate-400 focus-visible:ring-offset-2
                          disabled:pointer-events-none disabled:opacity-50
                          text-slate-50 bg-primary-700
                          hover:bg-primary-900
                          p-2"
                        href="/select"
                    >
                        <span className="p-2">OK</span>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

