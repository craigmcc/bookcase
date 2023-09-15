"use client"

// components/select/SelectLibraryForm.tsx

/**
 * Form for the /select page to choose which Library the user wants to
 * interact with.  Must be a client component so that we can update
 * LibraryContext with the selected Library.
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";
import {ChangeEvent, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {Button} from "@/components/my/Button";
import {LibraryPlus} from "@/types/models/Library";
import {SelectOption} from "@/types/types";
import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";
import Link from "next/link";

// Public Objects ------------------------------------------------------------

type SelectLibraryFormProps = {
    // The set of Libraries to be offered to the current user (must be filtered
    // by authorization scopes already).
    libraries: LibraryPlus[];
}


export default function SelectLibraryForm(props: SelectLibraryFormProps) {

    const [library, setLibrary] = useState<LibraryPlus | null>(null);
    const [libraryId, setLibraryId] = useState<number>(-1);

    const options: SelectOption[] = [];
    options.push({
        label: "Select a Library",
        value: "-1",
    });
    for (const library of props.libraries) {
        options.push({
            label: library.name,
            value: String(library.id),
        });
    }

    function onChange(event: ChangeEvent<HTMLSelectElement>) {
        const newLibraryId = Number(event.target.value);
        for (const thisLibrary of props.libraries) {
            if (thisLibrary.id === newLibraryId) {
                setLibraryId(thisLibrary.id);
                setLibrary(thisLibrary);
            }
        }
    }

    /**
     * Add a breadcrumb for this selection, and return the
     * associated href.
     */
    function onSelect(): string {
        //console.log("onSelect " + libraryId + " " + JSON.stringify(library));
        if (!library) {
            return "/";
        }
        const href = `/base/${library.id}`;
        BreadcrumbUtils.clear();
        BreadcrumbUtils.add({
            href: href,
            label: library.name,
        });
        //console.log("onSelect " + href);
        return href;
    }

    return (
        <>
            <select
                className="mb-2 border-2 w-full"
                onChange={onChange}
                value={libraryId}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <Link href={onSelect()}>
                <Button
                    disabled={libraryId < 0}
                    fullWidth
                    variant="primary"
                >
                    Select Library
                </Button>
            </Link>
        </>
    )

}
