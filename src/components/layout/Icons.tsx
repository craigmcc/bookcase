// components/layout/icons.tsx

/**
 * Icons from lucide-react that are used in this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Check,
    Github,
    Library,
    X,
    type XIcon as LucideIcon,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
    Check: Check,
    Github: Github,
    Library: Library,
    Uncheck: X,
}
