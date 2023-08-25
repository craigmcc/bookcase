// types/models/Author.ts

/**
 * Extended (from Prisma) types for Author model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, Author, AuthorsVolumes} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {PaginationOptions} from "@/types/types";

// Public Types --------------------------------------------------------------

// TODO - lots of stuff from AuthorActions.

export type AuthorsVolumesPlus = AuthorsVolumes & Prisma.AuthorsVolumesGetPayload<{
    include: {
        author: true,
        volume: true,
    }
}>
