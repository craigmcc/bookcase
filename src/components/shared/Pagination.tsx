// components/shared/Pagination.tsx

/**
 * Simple pagination controls.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {Button, ButtonProps} from "@/components/my/Button";
import {HandleAction} from "@/types/types";

// Public Objects ------------------------------------------------------------

interface PaginationProps {
    // One-relative current page number
    currentPage: number;
    // Handle "next" click [no handler]
    handleNext?: HandleAction;
    // Handle "previous" click [no handler]
    handlePrevious?: HandleAction;
    // Is this the last page? [false]
    lastPage: boolean;
    // Button variant style [info]
    variant?: ButtonProps["variant"];
}

export function Pagination(props: PaginationProps) {

    const variant = props.variant ? props.variant : "info";

    return (
        <div className="flex align-middle">
            <Button
                className="mr-1"
                disabled={props.currentPage === 1}
                onClick={props.handlePrevious ? props.handlePrevious : undefined}
                variant={variant}
            >
                <Icons.Previous/>
            </Button>
            <Button
                className="mr-1"
                disabled
                variant={variant}
            >
                {props.currentPage}
            </Button>
            <Button
                disabled={props.lastPage}
                onClick={props.handleNext ? props.handleNext : undefined}
                variant={variant}
            >
                <Icons.Next/>
            </Button>
        </div>
    )

}
