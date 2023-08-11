"use client"

/**
 * Generic standalone checkbox with optional label, accepting a function
 * to deal with changes.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useState} from "react";
import {useForm} from "react-hook-form";

// Internal Modules ----------------------------------------------------------

import {Checkbox} from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
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
    // Input control name [thisCheckBox] TODO currently ignored due to form usage
    name?: string;
    // Initial state [false]
    value?: boolean;
}

// Component Details ---------------------------------------------------------

export function CheckBox(props: CheckBoxProps) {

    const [value, setValue] =
        useState<boolean>(props.value !== undefined ? props.value : false);

    type FormFields = {
        thisCheckBox: boolean,
    }

    const form = useForm<FormFields>({
        defaultValues: {
            thisCheckBox: (typeof props.value !== "undefined") ? props.value : false,
        },
    });

    const handleClick = (newValue: boolean) => {
//        console.log("handleClick, new value =", newValue);
        setValue(newValue);
        if (props.handleValue) {
            props.handleValue(newValue);
        }
    }

    return (
        <div className={props.className ? props.className : undefined}>
            <Form {...form}>
                <form>
                    <FormField
                        control={form.control}
                        name="thisCheckBox"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        className="mr-2"
                                        onCheckedChange={() => field.onChange(!field.value)}
                                        onClick={() => handleClick(!field.value)}
                                    />
                                </FormControl>
                                <FormLabel>{props.label}</FormLabel>
                            </FormItem>
                        )}
                    />

                </form>
            </Form>
        </div>
    )

}

