// components/layout/SignInButton.tsx

/**
 * Button to trigger signing in to the site.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {MouseEventHandler} from "react";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {Button} from "@/components/my/Button";

// Public Objects ------------------------------------------------------------

export interface SignInButtonProps {
    // Optional CSS classes to add
    className?: string,
    // Required handler for button clicks
    onClick: MouseEventHandler<HTMLButtonElement>,
}

export function SignInButton(props: SignInButtonProps) {
    return (
        <Button
            className={props.className ? props.className : undefined}
            onClick={props.onClick}
            variant="primary"
        >
            <Icons.SignIn className="mr-1"/>
            Sign In
        </Button>
    )
}
