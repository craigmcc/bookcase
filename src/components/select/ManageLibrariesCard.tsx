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
import {redirect} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Public Objects ------------------------------------------------------------

export default function ManageLibrariesCard() {

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Manage Libraries</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-2 ml-3.0 w-full">
                    <Image
                        alt="Library"
                        height={330}
                        src="/images/libraries.jpg"
                        width={330}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full bg-secondary"
                    onClick={() => redirect("/libraries")}
                >
                    Manage Libraries
                </Button>
            </CardFooter>
        </Card>
    )

}
