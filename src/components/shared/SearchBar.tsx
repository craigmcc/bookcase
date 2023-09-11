"use client"

/**
 * Generic search bar with optional label, accepting a function to deal with
 * individual changes, and "Enter" key press, or both.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleString, OnChangeInput, OnKeyDown} from "@/types/types";

// Incoming Properties -------------------------------------------------------

type SearchBarProps = {
    // Should this element receive autofocus on rendering? [false]
    autoFocus?: boolean;
    // CSS class(es) to be added to this element [none]
    className?: string;
    // Should this element be disabled? [false]
    disabled?: boolean;
    // Handle value after each individual change [none]
    handleChange?: HandleString;
    // Handle value after "Enter" or "Tab" key is pressed [none]
    handleValue?: HandleString;
    // Label for the search box [no label]
    label?: string;
    // Input control name [searchBar]
    name?: string;
    // Placeholder text when no value has been entered [none]
    placeholder?: string;
    // Initial value to be rendered [empty string]
    value?: string;
}

// Component Details ---------------------------------------------------------

export function SearchBar(props: SearchBarProps) {

    const name = props.name ? props.name : "searchBar";
    const [value, setValue] =
        useState<string>(props.value ? props.value : "");

    // Force rerender if props or value change
    useEffect(() => {
        if (props.value !== undefined) {
            setValue(props.value);
        }
    }, [value, props.disabled, props.value]);

    // Handle individual character changes in the input
    const handleChange: OnChangeInput = (event) => {
        const newValue: string = event.target.value;
        setValue(newValue);
        if (props.handleChange) {
            props.handleChange(newValue);
        }
    }

    // Handle key down for "Enter" key
    const handleKeyDown: OnKeyDown = (event) => {
        if ((event.key === "Enter") && props.handleValue) {
            props.handleValue(value);
        }
    }

    return (
        <div className={props.className ? props.className : undefined}>
            {(props.label) ? (
                <label htmlFor={name}>
                    <span className="mr-2 text-sm">{props.label}</span>
                </label>
            ) : null }
            <input
                autoFocus={props.autoFocus ? props.autoFocus : undefined}
                className="text-sm border-2 w-full"
                disabled={props.disabled ? props.disabled : undefined}
                id={name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={props.placeholder ? props.placeholder : undefined}
                size={30}
                value={value}
            />
        </div>
    )

}
