// app/libraries/page.tsx

/**
 * React component for the "/libraries" page.  This is a server component,
 * so we delegate user authorization to the LibrariesList client component
 * that actually renders the table.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActions";
import LibraryList from "@/components/libraries/LibraryList";

// Caching Configuration -----------------------------------------------------

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = 0;            // Never cache

// Public Objects ------------------------------------------------------------

async function getLibraries(): Promise<LibraryActions.LibraryPlus[]> {
    return await LibraryActions.all();
}

export default async function LibrariesPage() {
    const libraries = await getLibraries();
    return (
        <div className="container mx-auto py-6">
            <LibraryList libraries={libraries}/>
        </div>
    )
}
