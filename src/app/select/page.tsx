// app/select/page.tsx

/**
 * Allow the user to select which Library they wish to manage,
 * or (for superuser) select an administrative function.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import ManageLibrariesCard from "@/components/select/ManageLibrariesCard";
import ManageUsersCard from "@/components/select/ManageUsersCard";
import SelectLibraryCard from "@/components/select/SelectLibraryCard";

// Public Objects ------------------------------------------------------------

export default function SelectPage() {

    return (
        <div className="container mx-auto p-6 grid grid-cols-3 gap-4">
            <div className="block h-full p-4">
                <SelectLibraryCard/>
            </div>
            {/* TODO: manage options restricted to superuser */}
            <div className="block h-full p-4">
                <ManageLibrariesCard/>
            </div>
            <div className="block h-full p-4">
                <ManageUsersCard/>
            </div>
        </div>
    )

}

