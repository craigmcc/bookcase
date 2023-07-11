"use client"

// app/layout-client.tsx

/**
 * Client component for the overall site layout, required because SessionProvider
 * must be in a client component.  The contents here go directly inside the
 * <body> tag in the parent root layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {SessionProvider} from "next-auth/react";

// Internal Modules ----------------------------------------------------------

import {RootLayoutProps} from "./layout";
import {SiteHeader} from "@/components/layout/SiteHeader";

// Public Objects ------------------------------------------------------------

export default function RootLayoutClient({children}: RootLayoutProps) {
    return (
        <SessionProvider>
            <div className="relative flex min-h-screen flex-col">
                <SiteHeader/>
                <div className="flex-1">{children}</div>
            </div>
        </SessionProvider>
    );
}
