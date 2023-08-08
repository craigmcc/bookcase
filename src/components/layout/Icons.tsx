// components/layout/icons.tsx

/**
 * Icons from lucide-react that are used in this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    ArrowBigLeft,
    ArrowDownToLine,
    Check,
    Github,
    Library,
    LogIn,
    LogOut,
    Pencil,
    Plus,
    X,
    XOctagon,
    type XIcon as LucideIcon,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
    Add: Plus,
    Back: ArrowBigLeft,
    Check: Check,
    Edit: Pencil,
    Github: Github,
    Library: Library,
    Remove: XOctagon,
    Save: ArrowDownToLine,
    SignIn: LogIn,
    SignOut: LogOut,
    Uncheck: X,
}
