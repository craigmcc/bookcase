"use client"

// components/select/ManageLibrariesCard.tsx

/**
 * Card for the /select page to choose to Manage Libraries
 * for this application.  Will be restricted to superusers.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Image from "next/image";
import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import {Button} from "@/components/my/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Public Objects ------------------------------------------------------------

export default function ManageLibrariesCard() {

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Manage Libraries</CardTitle>
                <CardDescription>
                    Browse and edit the set of Libraries belonging to this application.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 ml-3.0 w-full">
                    <Image
                        alt="Library"
                        height={330}
                        src="/images/libraries.jpg"
                        width={330}
                    />
                </div>
                <Link href="/libraries">
                    <Button
                        fullWidth
                        variant="secondary"
                    >
                        Manage Libraries
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )

}
