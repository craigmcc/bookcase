// components/shared/AddButton.tsx

/**
 * Button to trigger "add" navigation.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {Button} from "@/components/my/Button";

// Public Objects ------------------------------------------------------------

export interface BackButtonProps {
    // Optional CSS classes to add
    className?: string,
    // HREF to which the user should be redirected
    href: string,
}

export function AddButton(props: BackButtonProps) {
    const router = useRouter();
    return(
        <Button
            className={props.className ? props.className : undefined}
            onClick={() => router.push(`${props.href}`)}
            variant="primary"
        >
            <Icons.Add className="mr-1"/>
            Add
        </Button>
    )
}
