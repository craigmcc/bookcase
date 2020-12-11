// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Seed Data -----------------------------------------------------------------

// ***** Authors *****

// for "First Seed Library" (ids to be interpolated)
export const authorsFirst = [
    {
        "firstName": "Fred",
        "lastName": "Flintstone",
    },
    {
        "firstName": "Wilma",
        "lastName": "Flintstone",
    },
];

// For "Second Seed Library" (ids to be interpolated)
export const authorsSecond = [
    {
        "firstName": "Barney",
        "lastName": "Rubble",
    },
    {
        "firstName": "Betty",
        "lastName": "Rubble",
    },
];

// ***** Libraries *****

export const librariesData = [
    {
        "name": "First Seed Library",
        "scope": "first",
    },
    {
        "name": "Second Seed Library",
        "scope": "second",
    },
];

// ***** Stories *****

// For "First Seed" Library and Author (ids to be interpolated)
export const storiesFirst = [
    {
        "name": "My Story",
        "notes": "By Fred Flintstone",
    },
    {
        "name": "My Story", // Deliberate duplication
        "notes": "By Wilma Flintstone",
    },
    {
        "name": "Our Story",
        "notes": "By Fred Flintstone and Wilma Flintstone",
    },
];

// For "Second Seed" Library and Author (ids to be interpolated)
export const storiesSecond = [
    {
        "name": "My Story",
        "notes": "By Barney Rubble",
    },
    {
        "name": "My Story", // Deliberate duplication
        "notes": "By Betty Rubble",
    },
    {
        "name": "Our Story",
        "notes": "By Barney Rubble and Betty Rubble",
    },
];

export const oauthUsers = [
    {
        active: true,
        name: "Superuser User",
        password: "superuser",
        scope: "superuser",
        username: "superuser",
    },
    {
        active: true,
        name: "First Library Admin",
        password: "firstadmin",
        scope: "first admin regular",
        username: "firstadmin",
    },
    {
        active: true,
        name: "First Library Regular",
        password: "firstregular",
        scope: "first regular",
        username: "firstregular",
    },
    {
        active: true,
        name: "Second Library Admin",
        password: "secondadmin",
        scope: "second admin regular",
        username: "secondadmin",
    },
    {
        active: true,
        name: "Second Library Regular",
        password: "secondregular",
        scope: "second regular",
        username: "secondregular",
    },
]
