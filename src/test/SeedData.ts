// test/SeedData.ts

/**
 * Seed data for tests of Prisma-based actions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {
    Prisma,
} from "@prisma/client";

// Seed Data -----------------------------------------------------------------

// *** Libraries ***

export const LIBRARY_NAME_FIRST = "Test Library";
export const LIBRARY_NAME_SECOND = "Extra Library";
export const LIBRARY_SCOPE_FIRST = "scope1";
export const LIBRARY_SCOPE_SECOND = "scope2";
export const LIBRARY_NAME_THIRD = "Another Library";
export const LIBRARY_SCOPE_THIRD = "scope3";

// NOTE: Tests never touch any libraries except these!!!
export const LIBRARIES: Prisma.LibraryUncheckedCreateInput[] = [
    {
        name: LIBRARY_NAME_FIRST,
        scope: LIBRARY_SCOPE_FIRST,
    },
    {
        name: LIBRARY_NAME_SECOND,
        scope: LIBRARY_SCOPE_SECOND,
    },
    {
        active: false,
        name: LIBRARY_NAME_THIRD,
        scope: LIBRARY_SCOPE_THIRD,
    }
];

// *** Access Tokens ***

const ONE_DAY = 24 * 60 * 60 * 1000;    // One day (milliseconds)

export const ACCESS_TOKENS_SUPERUSER: Prisma.AccessTokenUncheckedCreateInput[] = [
    {
        expires: new Date(new Date().getTime() + ONE_DAY),
        scope: "superuser",
        token: "superuser_access_1",
        userId: -1, // userId must be seeded
    },
    {
        expires: new Date(new Date().getTime() - ONE_DAY),
        scope: "superuser",
        token: "superuser_access_2",
        userId: -1, // userId must be seeded
    },
];

// ***** Authors *****

// For FIRST_LIBRARY (libraryId to be interpolated)
export const AUTHORS_LIBRARY0: Prisma.AuthorUncheckedCreateInput[] = [
    {
        firstName: "Fred",
        lastName: "Flintstone",
        libraryId: -1, // libraryId must be seeded
    },
    {
        active: false,
        firstName: "Wilma",
        lastName: "Flintstone",
        libraryId: -1, // libraryId must be seeded
    },
];

// For SECOND_LIBRARY (libraryId to be interpolated)
export const AUTHORS_LIBRARY1: Prisma.AuthorUncheckedCreateInput[] = [
    {
        active: false,
        firstName: "Barney",
        lastName: "Rubble",
        libraryId: -1, // libraryId must be seeded
    },
    {
        firstName: "Betty",
        lastName: "Rubble",
        libraryId: -1, // libraryId must be seeded
    },
];

// *** Refresh Tokens ***

export const REFRESH_TOKENS_SUPERUSER: Prisma.RefreshTokenUncheckedCreateInput[] = [
    {
        accessToken: "superuser_access_1",
        expires: new Date(new Date().getTime() + ONE_DAY),
        token: "superuser_refresh_1",
        userId: -1, // userId must be seeded
    },
    {
        accessToken: "superuser_access_2",
        expires: new Date(new Date().getTime() - ONE_DAY),
        token: "superuser_refresh_2",
        userId: -1, // userId must be seeded
    },
];

// ***** Series *****

export const SERIES_LIBRARY0: Prisma.SeriesUncheckedCreateInput[] = [
    {
        libraryId: -1, // libraryId must be seeded
        name: "Flintstone Series",
    },
    {
        active: false,
        libraryId: -1, // libraryId must be seeded
        name: "Fred and Wilma Series",
    }
]

export const SERIES_LIBRARY1: Prisma.SeriesUncheckedCreateInput[] = [
    {
        libraryId: -1, // libraryId must be seeded
        name: "Rubble Series",
    },
    {
        active: false,
        libraryId: -1, // libraryId must be seeded
        name: "Barney and Betty Series",
    }
]

// ***** Stories *****

// For FIRST_LIBRARY (libraryId to be interpolated)
export const STORIES_LIBRARY0: Prisma.StoryUncheckedCreateInput[] = [
    {
        libraryId: -1, // libraryId must be seeded
        name: "Fred Story",
    },
    {
        active: false,
        libraryId: -1, // libraryId must be seeded
        name: "Wilma Story",
    },
    {
        libraryId: -1, // libraryId must be seeded
        name: "Flintstone Story",
    }
];

// For SECOND_LIBRARY (libraryId to be interpolated)
export const STORIES_LIBRARY1: Prisma.StoryUncheckedCreateInput[] = [
    {
        active: false,
        libraryId: -1, // libraryId must be seeded
        name: "Barney Story",
    },
    {
        libraryId: -1, // libraryId must be seeded
        name: "Betty Story",
    },
    {
        libraryId: -1, // libraryId must be seeded
        name: "Rubble Story",
    }
];

// ***** Users *****

export const USER_SCOPE_SUPERUSER = "superuser";
export const USER_SCOPE_FIRST_ADMIN = `${LIBRARY_SCOPE_FIRST}:admin`;
export const USER_SCOPE_FIRST_REGULAR = `${LIBRARY_SCOPE_FIRST}:regular`;
export const USER_SCOPE_SECOND_ADMIN = `${LIBRARY_SCOPE_SECOND}:admin`;
export const USER_SCOPE_SECOND_REGULAR = `${LIBRARY_SCOPE_SECOND}:regular`;

export const USER_USERNAME_SUPERUSER = "superuser";
export const USER_USERNAME_FIRST_ADMIN = "firstadmin";
export const USER_USERNAME_FIRST_REGULAR = "firstregular";
export const USER_USERNAME_SECOND_ADMIN = "secondadmin";
export const USER_USERNAME_SECOND_REGULAR = "secondregular";

export const USERS: Prisma.UserUncheckedCreateInput[] = [
    {
        active: true,
        name: "First Admin User",
        password: "password",
        scope: USER_SCOPE_FIRST_ADMIN,
        username: USER_USERNAME_FIRST_ADMIN,
    },
    {
        active: true,
        name: "First Regular User",
        password: "password",
        scope: USER_SCOPE_FIRST_REGULAR,
        username: USER_USERNAME_FIRST_REGULAR,
    },
    {
        active: false,
        name: "Second Admin User",
        password: "password",
        scope: USER_SCOPE_SECOND_ADMIN,
        username: USER_USERNAME_SECOND_ADMIN,
    },
    {
        active: false,
        name: "Second Regular User",
        password: "password",
        scope: USER_SCOPE_SECOND_REGULAR,
        username: USER_USERNAME_SECOND_REGULAR,
    },
    {
        active: true,
        name: "Superuser User",
        password: "password",
        scope: USER_SCOPE_SUPERUSER,
        username: USER_USERNAME_SUPERUSER,
    }
];

// ***** Volumes *****

// For FIRST_LIBRARY (libraryId to be interpolated)
export const VOLUMES_LIBRARY0: Prisma.VolumeUncheckedCreateInput[] = [
    {
        active: false,
        googleId: "111",
        isbn: "aaa",
        libraryId: -1, // libraryId must be seeded
        location: "Box",
        name: "Fred Volume",
        type: "Anthology",
    },
    {
        googleId: "222",
        isbn: "222",
        libraryId: -1, // libraryId must be seeded
        location: "Computer",
        name: "Wilma Volume",
        type: "Collection",
    },
    {
        googleId: "333",
        isbn: "ccc",
        libraryId: -1, // libraryId must be seeded
        location: "Kindle",
        name: "Flintstone Volume",
        type: "Single",
    }
];

// For SECOND_LIBRARY (libraryId to be interpolated)
export const VOLUMES_LIBRARY1: Prisma.VolumeUncheckedCreateInput[] = [
    {
        googleId: "444",
        isbn: "ddd",
        libraryId: -1, // libraryId must be seeded
        location: "Kobo",
        name: "Barney Volume",
        type: "Anthology",
    },
    {
        active: false,
        googleId: "555",
        isbn: "eee",
        libraryId: -1, // libraryId must be seeded
        location: "Other",
        name: "Betty Volume",
        type: "Collection",
    },
    {
        googleId: "666",
        isbn: "fff",
        libraryId: -1, // libraryId must be seeded
        location: "Returned",
        name: "Rubble Volume",
        type: "Single",
    }
];
