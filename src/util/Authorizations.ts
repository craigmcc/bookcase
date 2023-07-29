// util/Authorizations.ts

/**
 * Functions to validate whether a specified user has permissions
 * to interact with a specified library.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {
    Library,
    User,
} from "@prisma/client";

// Public Objects ------------------------------------------------------------

/**
 * Is this User allowed "admin" access to this Library?
 *
 * @param user                          User to be checked
 * @param library                       Library to be checked
 */
export function authorizedAdmin(user: User, library: Library): boolean {
    const scopes = user.scope.split(" ");
    if (scopes.includes("superuser")) {
        return true;
    }
    if (scopes.includes(`${library.scope}:admin`)) {
        return true;
    }
    return false;
}
/**
 * Is this User allowed "regular" access to this Library?
 *
 * @param user                          User to be checked
 * @param library                       Library to be checked
 */
export function authorizedRegular(user: User, library: Library): boolean {
    const scopes = user.scope.split(" ");
    if (scopes.includes("superuser")) {
        return true;
    }
    if (scopes.includes(`${library.scope}:admin`)) {
        return true;
    }
    if (scopes.includes(`${library.scope}:regular`)) {
        return true;
    }
    return false;
}

/**
 * Is this User an authorized superuser?
 *
 * @param user                          User to be checked
 */
export function authorizedSuperuser(user: User): boolean {
    const scopes = user.scope.split(" ");
    return scopes.includes("superuser");
}
