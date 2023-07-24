// components/layout/SignOutButton.tsx

/**
 * Button to trigger signing out from the site.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {MouseEventHandler} from "react";

// Internal Modules ----------------------------------------------------------

import {Button} from "@/components/ui/button";

// Public Objects ------------------------------------------------------------

export interface SignOutButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>
}

export function SignOutButton(props: SignOutButtonProps) {
    return (
        <Button
            className="bg-primary-700"
            onClick={props.onClick}
        >
            Sign Out
        </Button>
    )
}
