// app/libraries/[libraryId]/page.tsx

/**
 * Editing page for Library objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Library, Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActions";
import LibraryForm from "@/components/libraries/LibraryForm";

// Public Objects ------------------------------------------------------------

export default async function LibraryPage({params}: {params: {libraryId: string}}) {

    const id = Number(params.libraryId);
    const library: Library = (id < 0)
        ? {
            id: -1,
            active: true,
            name: "",
            notes: null,
            scope: "",
          }
        : await getLibrary(id);

    const handleSave = async (saved: Library) => {
        "use server"
        if (saved.id < 0) {
            const input: Prisma.LibraryCreateInput = {
                // Omit id
                active: saved.active,
                name: saved.name,
                notes: saved.notes,
                scope: saved.scope,
            }
            await LibraryActions.insert(input);
        } else {
            const input: Prisma.LibraryUpdateInput = {
                ...saved,
            }
            await LibraryActions.update(saved.id, input);
        }
    }

    return (
        <div className="container mx-auto py-6">
            <LibraryForm
                handleSave={handleSave}
                library={library}
            />
        </div>
    )
}

// Private Objects -----------------------------------------------------------

async function getLibrary(libraryId: number): Promise<LibraryActions.LibraryPlus> {
    return await LibraryActions.find(libraryId);
}

