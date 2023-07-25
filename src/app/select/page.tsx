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
        <div className="flex mx-auto py-10">
            <SelectLibraryCard/>
            {/* TODO: manage options restricted to superuser */}
            <ManageLibrariesCard/>
            <ManageUsersCard/>
        </div>
    )

}

