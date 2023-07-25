"use client"

// components/select/ManageUsersCard.tsx

/**
 * Card for the /select page to choose to Manage Users
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

export default function ManageUsersCard() {

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
                <span>TODO: Users image goes here</span>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full bg-secondary"
                    onClick={() => redirect("/users")}
                >
                    Manage Users
                </Button>
            </CardFooter>
        </Card>
    )

}
