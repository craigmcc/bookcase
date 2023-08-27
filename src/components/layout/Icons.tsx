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
    BookCopy,
    Check,
    ChevronLeft,
    ChevronRight,
    Folders,
    Github,
    Library,
    LogIn,
    LogOut,
    Pencil,
    Plus,
    Rows,
    Users,
    X,
    XOctagon,
    type XIcon as LucideIcon,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
    Add: Plus,
    Authors: Users,
    Back: ArrowBigLeft,
    Check: Check,
    Edit: Pencil,
    Github: Github,
    Library: Library,
    Next: ChevronRight,
    Previous: ChevronLeft,
    Remove: XOctagon,
    Save: ArrowDownToLine,
    Series: Rows,
    SignIn: LogIn,
    SignOut: LogOut,
    Stories: Folders,
    Uncheck: X,
    Volumes: BookCopy,
}
