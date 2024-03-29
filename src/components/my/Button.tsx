// components/my/Button.tsx

/**
 * Customizable Button component, based on Radix-UI and ShadCN concepts and styles.
 *
 * NOTE: Depends on the custom color scheme extensions being added
 * in tailwind-config.js at the root directory of this project.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {cva, type VariantProps} from "class-variance-authority";
import * as React from "react";
import {Slot} from "@radix-ui/react-slot";

// Internal Modules ----------------------------------------------------------

import {cn} from "@/lib/utils";

// Public Objects ------------------------------------------------------------

/**
 * Configuration of variant options, created by CVA.
 */
export const ButtonVariants = cva(
    // Base styles added to every component
    [
        "inline-flex", "items-center", "justify-center", "rounded-sm",
        "text-sm", "font-medium",
        "disabled:pointer-events-none", "disabled:opacity-50",
    ],
    {
        variants: {
            // Conditional full width selection
            fullWidth: { true: "w-full", false: "w-fit" },
            // Component size selection
            size: {
                xs: "h-5 rounded-md px-1",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
            // Overall style selection
            // TODO: dark mode support across the board
            variant: {
                info: [
                    "bg-info-700", "hover:bg-info-900", "text-slate-50",
                ],
                // TODO: outline with different border colors?
                outline: [
                    "border", "border-primary", "bg-white",
                    "text-slate-50", "hover:text-slate-900",
                ],
                primary: [
                    "bg-primary-700", "hover:bg-primary-900", "text-slate-50",
                ],
                secondary: [
                    "bg-secondary-700", "hover:bg-secondary-900", "text-slate-50",
                ],
                success: [
                    "bg-success-700", "hover:bg-success-900", "text-slate-50",
                ],
                warning: [
                    "bg-warning-700", "hover:bg-warning-900", "text-slate-50",
                ],
            },
        },
        // Defaults for variants that are not specified
        defaultVariants: {
            fullWidth: false,
            size: "sm",
            variant: "primary",
        }
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof ButtonVariants> {
    asChild?: boolean,
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, fullWidth, size, variant, asChild = false, ...props}, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(ButtonVariants({className, fullWidth, size, variant}))}
                ref={ref}
                {...props}
            />
        )
    }
);
Button.displayName = "Button";
