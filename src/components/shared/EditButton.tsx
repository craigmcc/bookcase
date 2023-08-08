// components/shared/EditButton.tsx

/**
 * Button to trigger "edit" navigation.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {Button} from "@/components/my/Button";

// Public Objects ------------------------------------------------------------

export interface EditButtonProps {
    // Optional CSS classes to add
    className?: string,
    // HREF to which the user should be redirected
    href: string,
}

export function EditButton(props: EditButtonProps) {
    const router = useRouter();
    return(
        <Button
            className={props.className ? props.className : undefined}
            onClick={() => router.push(`${props.href}`)}
            variant="success"
        >
            <Icons.Edit className="mr-1"/>
            Edit
        </Button>
    )
}
