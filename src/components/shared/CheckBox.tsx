"use client"

/**
 * Generic standalone checkbox with optional label, accepting a function
 * to deal with changes.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {Checkbox} from "@/components/ui/checkbox";
import {HandleBoolean} from "@/types/types";

// Incoming Properties -------------------------------------------------------

type CheckBoxProps = {
    // Should this element receive autofocus on rendering? [false]
    autoFocus?: boolean;
    // CSS class(es) to be added to this element [none]
    className?: string;
    // Should this element be disabled? [false]
    disabled?: boolean;
    // Handle value change [none]
    handleValue?: HandleBoolean;
    // Label for the checkbox [NO DEFAULT]
    label: string;
    // Input control name [checkBox]
    name?: string;
    // Initial state [false]
    value?: boolean;
}

// Component Details ---------------------------------------------------------

export function CheckBox(props: CheckBoxProps) {

    const name = props.name ? props.name : "checkBox";
    const [value, setValue] =
        useState<boolean>(props.value !== undefined ? props.value : false);

    // Force rerender if props or value change
    useEffect(() => {
    }, [value, props.disabled, props.value]);

    // Handle value change in the input
    const handleChange = () => {
        const newValue = !value;
        setValue(newValue);
        if (props.handleValue) {
            props.handleValue(newValue);
        }
    }

    return (
        <div className={props.className ? props.className : undefined}>
            <Checkbox
                autoFocus={props.autoFocus ? props.autoFocus : undefined}
                checked={value}
                className="mr-2"
                disabled={props.disabled}
                onChange={() => handleChange()}
            />
            <label htmlFor={name}>
                <span className="text-sm">{props.label}</span>
            </label>
        </div>
    )

}

