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
import {Button, ButtonProps} from "@/components/my/Button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Public Objects ------------------------------------------------------------

export interface EditButtonProps {
    // Optional CSS classes to add
    className?: string,
    // HREF to which the user should be redirected
    href: string,
    // Button size (xs/sm/lg/icon) [sm]
    size?: ButtonProps["size"];
    // Show the label text? [true]
    showLabel?: boolean;
}

export function EditButton(props: EditButtonProps) {
    const router = useRouter();
    const showLabel = (props.showLabel !== undefined) ? props.showLabel : true;
    return(
        <>
            {(showLabel) ? (
                <EditButtonTrigger {...props}/>
            ) : (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipContent>
                            Edit
                        </TooltipContent>
                        <TooltipTrigger>
                            <EditButtonTrigger {...props}/>
                        </TooltipTrigger>
                    </Tooltip>
                </TooltipProvider>
            )}
        </>
    )
}

function EditButtonTrigger(props: EditButtonProps) {

    const router = useRouter();

    const showLabel = (props.showLabel !== undefined) ? props.showLabel : true;

    return (
        <Button
            className={props.className ? props.className : undefined}
            onClick={() => router.push(`${props.href}`)}
            size={(props.size) ? props.size : undefined}
            variant="success"
        >
            <Icons.Edit className={(showLabel) ? "mr-1" : undefined} />
            {(showLabel) ? (
                <span>Edit</span>
            ) : null }
        </Button>
    )

}
