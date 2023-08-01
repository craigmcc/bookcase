"use client"

// components/shared/NotSelected.tsx

/**
 * Display a dialog indicating that a user has not yet selected a Library
 * to be worked on.  Redirects the user to the "/select" page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";
import {useState} from "react";

// Internal Modules ----------------------------------------------------------

import {Button} from "@/components/ui/button";
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

export default function NotSSelected() {
    return (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>No Selected Library</AlertDialogTitle>
                    <AlertDialogDescription>
                        You must have selected a Library to use this function.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction asChild>
                        <Link href="/select">
                            <Button
                                className="bg-primary-700 hover:bg-primary-900"
                            >
                                Select Library
                            </Button>
                        </Link>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

