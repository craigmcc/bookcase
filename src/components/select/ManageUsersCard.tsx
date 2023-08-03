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

export default function ManageUsersCard() {

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>
                    Browse and edit the set of Users authorized to use this application.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-2 ml-6">
                    <Image
                        alt="Users"
                        height={250}
                        src="/images/users.png"
                        width={250}
                    />
                </div>
                <Link href="/users">
                <Button
                    fullWidth
                    variant="secondary"
                >
                    Manage Users
                </Button>
                </Link>
            </CardContent>
        </Card>
    )

}
