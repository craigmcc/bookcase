// ActionButton --------------------------------------------------------------

// Renders a generic button control, configured by the specified properties.

// External Modules ----------------------------------------------------------

import React from "react";
import Button from "react-bootstrap/Button";

// Internal Modules ----------------------------------------------------------

import { ButtonSize, ButtonType, OnClick, Variant } from "./Types";

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;        // Set automatic focus on this element? [false]
    disabled?: boolean;         // Mark button disabled? [not rendered]
    label?: string;             // Button label [Action]
    onClick?: OnClick;          // Handle (event) for button click [not rendered]
    size?: ButtonSize;          // Size of this button [sm]
    type?: ButtonType;          // Type of this button [button]
    variant?: Variant;          // Style variant [warning]
}

// Component Details ---------------------------------------------------------

export const ActionButton = (props: Props) => {

    return (
        <>
            <Button
                autoFocus={props.autoFocus ? props.autoFocus : undefined}
                data-testid="ActionButton"
                disabled={props.disabled ? props.disabled : undefined}
                onClick={props.onClick ? props.onClick : undefined}
                size={props.size ? props.size : undefined}
                type={props.type ? props.type : undefined}
                variant={props.variant ? props.variant : "warning"}
            >
                {props.label ? props.label : "Action"}
            </Button>
        </>
    )

}

export default ActionButton;
