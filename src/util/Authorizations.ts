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
    const required = library.scope + ":admin";
    for (const scope in scopes) {
        if (scope === "superuser") {
            return true;
        } else if (scope === required) {
            return true;
        }
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
    const required1 = library.scope + ":admin";
    const required2 = library.scope + ":regular";
    for (const scope in scopes) {
        if (scope === "superuser") {
            return true;
        } else if (scope === required1) {
            return true;
        } else if (scope === required2) {
            return true;
        }
    }
    return false;
}


