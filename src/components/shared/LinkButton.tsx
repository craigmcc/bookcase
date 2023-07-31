"use client"

// components/shared/LinkButton.tsx

/**
 * Render a Link that looks like a ShadCN Button component, but does not
 * require a Next.Js "redirect" to work.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type LinkButtonProps = {
    /**
     * Space-delimited set of CSS class names to be appended to the standard
     * rendering.  You will always want a "bg-xxxxx" and possibly a
     * "border:bg-xxxxx" to set the background color by default and when
     * hovering, and may want things like "w-full".
     */
    className?: string,
    /**
     * The link HREF that should be navigated to if this button is clicked.
     */
    href: string,
    /**
     * The textual label for this button.
     */
    label: string,
}

export default function LinkButton(props: LinkButtonProps) {

    // The CSS properties for this component
    let className = "inline-flex items-center justify-center rounded"
        + " text-sm font-medium text-slate-50 p-2"
        + " disabled:pointer-events-none disabled:opacity-50";
    if (props.className) {
        className += className + " " + props.className;
    }

    // Return the rendered component
    return (
        <Link
            className={className}
            href={props.href}
        >
            {props.label}
        </Link>
    )

}
