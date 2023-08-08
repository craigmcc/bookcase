// components/layout/SignOutButton.tsx

/**
 * Button to trigger signing out from the site.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {MouseEventHandler} from "react";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {Button} from "@/components/my/Button";

// Public Objects ------------------------------------------------------------

export interface SignOutButtonProps {
    // Optional CSS classes to add
    className?: string,
    // Required handler for button clicks
    onClick: MouseEventHandler<HTMLButtonElement>,
}

export function SignOutButton(props: SignOutButtonProps) {
    return (
        <Button
            className={props.className ? props.className : undefined}
            onClick={props.onClick}
            variant="info"
        >
            <Icons.SignOut className="mr-1"/>
            Sign Out
        </Button>
    )
}
