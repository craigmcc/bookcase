"use client"

// components/libraries/UserCard.tsx

/**
 * Wrapper around UserForm with a Card presentation.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {User} from"@prisma/client";

// Internal Modules ----------------------------------------------------------

import UserForm from "./UserForm";
import {BackButton} from "@/components/shared/BackButton";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Public Objects ------------------------------------------------------------

type UserCardProps = {
    // Navigation destination for Back button [/users]
    back?: string,
    // Navigation destination after successful save operation [/users]
    destination?: string,
    // Library to be edited (id < 0 means adding)
    user: User;
}

export default function UserCard(props: UserCardProps) {

    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>
                    <div className="grid grid-cols-3">
                        <div>
                            <BackButton
                                href={props.back ? props.back : "/users"}
                            />
                        </div>
                        <div className="col-span-2 flex items-center">
                            {(props.user.id < 0) ? (
                                <span>Add New User</span>
                            ) : (
                                <span>Edit Existing User</span>
                            )}
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <UserForm
                    destination={props.destination ? props.destination : undefined}
                    showHeader={false}
                    user={props.user}
                />
            </CardContent>
        </Card>
    )

}
