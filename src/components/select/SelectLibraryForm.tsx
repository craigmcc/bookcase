"use client"

// components/select/SelectLibraryForm.tsx

/**
 * Form for the /select page to choose which Library the user wants to
 * interact with.  Must be a client component so that we can update
 * LibraryContext with the selected Library.
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";
import {ChangeEvent, useContext, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {Button} from "@/components/my/Button";
import {LibraryPlus} from "@/types/models/Library";
import {SelectOption} from "@/types/types";

// Public Objects ------------------------------------------------------------

type SelectLibraryFormProps = {
    // The set of Libraries to be offered to the current user (must be filtered
    // by authorization scopes already).
    libraries: LibraryPlus[];
}


export default function SelectLibraryForm(props: SelectLibraryFormProps) {

    const [libraryId, setLibraryId]
        = useState<number>(-1);

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
//        console.log("Selecting: ", libraryId);
        setLibraryId(newLibraryId);
        for (const library of props.libraries) {
            if (library.id === newLibraryId) {
//                console.log("Storing: ", library);
            }
        }
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
            <Link href={`/base/${libraryId}`}>
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
