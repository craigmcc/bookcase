// config/siteConfig.ts

/**
 * Configuration variables for the entire site.
 *
 * @packageDocumentation
 */

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    description: "Library Management Application based on NextJS",
    links: {
        github: "https://github.com/craigmcc/bookcase"
    },
    mainNav: [
        {
            title: "Select",
            href: "/select",
        },
/* No longer viable because URL must be /base/{libraryId} now
        {
            title: "Base",
            href: "/base",
        },
*/
        {
            title: "Libraries",
            href: "/libraries",
        },
/*
        {
            title: "Authors",
            href: "/authors",
        },
*/
/*
        {
            title: "Series",
            href: "/series",
        },
*/
/*
        {
            title: "Stories",
            href: "/stories",
        },
*/
/*
        {
            title: "Volumes",
            href: "/volumes",
        },
*/
        {
            title: "Users",
            href: "/users",
        },
    ],
    name: "Bookcase",
}
