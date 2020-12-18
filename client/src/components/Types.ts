// Types ---------------------------------------------------------------------

// Library-wide Typescript Type Definitions

// External Modules ----------------------------------------------------------

import React from "react";

// Internal Modules ----------------------------------------------------------

// Types Details -------------------------------------------------------------

// Base property type definitions for generic field-related component types

export interface BaseActionProps {
    action?: string;            // Action button text [no <Col> is rendered]
    actionClassName?: string;   // CSS styles for action <Col> [not rendered]
    actionDisabled?: boolean;   // Mark action button disabled? [not rendered]
    actionSize?: ButtonSize;    // Action button size [sm]
    actionType?: ButtonType;    // Action button type [button]
    actionVariant?: Variant;    // Action button style variant [not rendered]
    autoFocus?: boolean;        // Set automatic focus on this element? [false]
    onClick?: OnClick;          // Handle (event) for button click [not rendered]
    required?: boolean;         // Mark field as required? [not rendered]
}

export interface BaseAreaProps extends BaseInputProps {
    cols?: number               // Visible width (in characters) [not rendered]
    maxLength?: number;         // Maximum characters allowed [not rendered]
    minLength?: number;         // Minimum characters allowed [not rendered]
    onKeyDown?: OnKeyDown;      // Handle (event) on a key down [not rendered]
    placeholder?: string;       // Placeholder text for no value [not rendered]
    rows?: number               // Visible height (in rows) [not rendered]
}

export interface BaseElementProps {
    elementClassName?: string;  // CSS styles for element <Row> [DEFAULT_ELEMENT_CLASS_NAME]
}

export interface BaseInputProps {
    autoFocus?: boolean;        // Set automatic focus on this element? [false]
    controlClassName?: string;  // CSS styles for input field [DEFAULT_CONTROL_CLASS_NAME]
    fieldClassName?: string;    // CSS styles for field <Col> [DEFAULT_INPUT_CLASS_NAME]
    fieldDisabled?: boolean;    // Mark field as disabled? [false]
    fieldName: string;          // HTML field name [*REQUIRED*]
    fieldValue?: any;           // Initially displayed field value [not rendered]
                                // (should always be a React state value or a prop)
    onBlur?: OnBlur;             // Handle (event) for losing focus [not rendered]
    onChange?: OnChange;         // Handle (event) for value change [not rendered]
    onFocus?: OnFocus;           // Handle (event) for gaining focus [not rendered]
    readOnly?: boolean;         // Mark control as read only? [false]
    required?: boolean;         // Mark field as required? [not rendered]
}

export interface BaseLabelProps {
    fieldName: string;          // Field name for label mapping [*REQUIRED*]
    label?: string;             // Label text [no <Col> is rendered]
    labelClassName?: string;    // CSS styles for label <Col> [DEFAULT_LABEL_CLASS_NAME]
}

// Input field for textual data
export interface BaseTextProps extends BaseInputProps {
    max?: string;               // Maximum allowed value [not rendered]
    maxLength?: number;         // Maximum characters allowed [not rendered]
    min?: string;               // Minimum value allowed [not rendered]
    minLength?: number;         // Minimum characters allowed [not rendered]
    onKeyDown?: OnKeyDown;      // Handle (event) on a key down [not rendered]
    pattern?: string;           // Regular expression match allowed [not rendered]
    placeholder?: string;       // Placeholder text for no value [not rendered]
    type?: string;              // Input control type [text]
}

// Detailed Field Types ------------------------------------------------------

export type ButtonSize = "lg" | "sm";
export type ButtonType = "button" | "reset" | "submit";
export type SelectOption = {
    label: string;              // Label shown for this option [*REQUIRED*]
    value: string | number;     // Value returned for this option [*REQUIRED*]
                                // (will be rendered as a string)
}
export type SelectOptions = SelectOption[];
export type Variant = "primary" | "secondary" | "success" | "warning" | "danger"
    | "info" | "light" | "dark";

// HTML Event Handlers -------------------------------------------------------

export type OnBlur = (event: React.FocusEvent<HTMLElement>) => void;
export type OnChange = (event: React.ChangeEvent<HTMLElement>) => void;
export type OnClick = (event: React.MouseEvent<HTMLElement>) => void;
export type OnFocus = (event: React.FocusEvent<HTMLElement>) => void;
export type OnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => void;
