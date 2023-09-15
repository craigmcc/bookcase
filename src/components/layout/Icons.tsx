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
    BookOpen,
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
    ScrollText,
    User,
    Users,
    X,
    XOctagon,
    type XIcon as LucideIcon,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
    Add: Plus,
    Author: User,
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
    Story: ScrollText,
    Stories: Folders,
    Uncheck: X,
    Volume: BookOpen,
    Volumes: BookCopy,
}
