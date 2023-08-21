"use client"

// components/libraries/LibraryCard.tsx

/**
 * Wrapper around LibraryForm with a Card presentation.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Library} from"@prisma/client";

// Internal Modules ----------------------------------------------------------

import LibraryForm from "./LibraryForm";
import {BackButton} from "@/components/shared/BackButton";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Public Objects ------------------------------------------------------------

type LibraryCardProps = {
    // Navigation destination for Back button [/libraries]
    back?: string,
    // Navigation destination after successful save operation [/libraries]
    destination?: string,
    // Library to be edited (id < 0 means adding)
    library: Library;
}

export default function LibraryCard(props: LibraryCardProps) {

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>
                    <div className="grid grid-cols-3">
                        <div>
                            <BackButton
                                href={props.back ? props.back : "/libraries"}
                            />
                        </div>
                        <div className="col-span-2 flex items-center">
                            {(props.library.id < 0) ? (
                                <span>Add New Library</span>
                            ) : (
                                <span>Edit Existing Library</span>
                            )}
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <LibraryForm
                    destination={props.destination ? props.destination : undefined}
                    library={props.library}
                    showHeader={false}
                />
            </CardContent>
        </Card>
    )

}
