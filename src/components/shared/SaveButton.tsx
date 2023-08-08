// components/shared/SaveButton.tsx

/**
 * Button to perform a submit action on a form.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {Button} from "@/components/my/Button";

// Public Objects ------------------------------------------------------------

export interface SaveButtonProps {
    // Optional CSS classes to add
    className?: string,
}

export function SaveButton(props: SaveButtonProps) {
    const router = useRouter();
    return(
        <Button
            className={props.className ? props.className : undefined}
            type="submit"
            variant="primary"
        >
            <Icons.Save className="mr-1"/>
            Save
        </Button>
    )
}
