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
    // CSS to add to the surrounding element [none]
    className?: string;
    // One-relative current page number
    currentPage: number;
    // Handle "next" click [no handler]
    handleNext?: HandleAction;
    // Handle "previous" click [no handler]
    handlePrevious?: HandleAction;
    // Is this the last page? [false]
    lastPage: boolean;
    // Button size (xs/sm/lg/icon) [sm]
    size?: ButtonProps["size"];
    // Button variant style [info]
    variant?: ButtonProps["variant"];
}

export function Pagination(props: PaginationProps) {

    const size = props.size ? props.size : "sm";
    const variant = props.variant ? props.variant : "info";

    return (
        <div className={props.className ? props.className : "flex align-middle"}>
            <Button
                className="flex mr-1"
                disabled={props.currentPage === 1}
                onClick={props.handlePrevious ? props.handlePrevious : undefined}
                size={size}
                variant={variant}
            >
                <Icons.Previous/>
            </Button>
            <Button
                className="flex mr-1"
                disabled
                size={size}
                variant={variant}
            >
                {props.currentPage}
            </Button>
            <Button
                className="flex"
                disabled={props.lastPage}
                onClick={props.handleNext ? props.handleNext : undefined}
                size={size}
                variant={variant}
            >
                <Icons.Next/>
            </Button>
        </div>
    )

}
