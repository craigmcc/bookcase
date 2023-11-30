// api/auth/[...nextauth]/route.ts

/**
 * Route definitions for next-auth (authentication and authorization).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import NextAuth from "next-auth";

// Internal Modules ----------------------------------------------------------

import {authOptions} from "./authOptions";

// Public Objects ------------------------------------------------------------

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
