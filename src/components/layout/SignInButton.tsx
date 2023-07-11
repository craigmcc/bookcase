// components/layout/SignInButton.tsx

/**
 * Button to trigger signing in to the site.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {MouseEventHandler} from "react";

// Internal Modules ----------------------------------------------------------

import {Button} from "@/components/ui/button";

// Public Objects ------------------------------------------------------------

export interface SignInButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>
}

export function SignInButton(props: SignInButtonProps) {
    return (
        <Button
            onClick={props.onClick}
        >
            Sign In
        </Button>
    )
}
