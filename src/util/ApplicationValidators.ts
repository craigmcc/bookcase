// util/ApplicationValidators -----------------------------------------------------

/**
 * Application specific validators that do not require database access, and are
 * therefore not async functions.  In all cases, a "true" return indicates that
 * the proposed value is valid, while "false" means it is not.  If a field is
 * required, that must be validated separately.
 *
 * @packageDocumentation
 */

// Internal Modules ---------------------------------------------------------

import {SelectOption} from "@/types/types";

// Public Objects -----------------------------------------------------------

export const validateHref = (href: string): boolean => {
    for (const pattern of VALID_HREF_PATTERNS) {
        if (pattern.test(href)) {
            return true;
        }
    }
    return false;
}

/**
 * These patterns should cover ALL cases where an HREF might be included
 * in a URL (such as a "back" or "dest" search parameter) that could be
 * transmitted by a user, rather than programmatically calculated by this
 * application.
 */
const VALID_HREF_PATTERNS = [
    /^\/authors\/\d+\/\d+$/,
    /^\/base\/\d+\/authors\/\d+$/,
    /^\/base\/\d+\/series\/\d+$/,
    /^\/base\/\d+\/stories\/\d+$/,
    /^\/base\/\d+\/volumes\/\d+$/,
    /^\/series\/\d+\/\d+$/,
    /^\/stories\/\d+\/\d+$/,
    /^\/volumes\/\d+\/\d+$/,
];

export const validateLibraryScope = (scope: string | undefined): boolean => {
    if (!scope || (scope.length === 0)) {
        return true;
    }
    return scope.match(LIBRARY_SCOPE_PATTERN) !== null;
}

export const LIBRARY_SCOPE_PATTERN: RegExp = /^[a-zA-Z0-9]+$/;

export const validateVolumeLocation = (location: string | null | undefined): boolean => {
    if (!location) {
        return true;
    } else {
        for (const validVolumeLocation of VALID_VOLUME_LOCATIONS) {
            if (validVolumeLocation.value === location) {
                return true;
            }
        }
        return false;
    }
}

export const VALID_VOLUME_LOCATIONS: SelectOption[] = [
    { value: "Box",          label: "Book in a Box (see Notes)"},
    { value: "Computer",     label: "Computer Download (PDF etc.)"},
    { value: "Kindle",       label: "Kindle Download"},
    { value: "Kobo",         label: "Kobo Download"},
    { value: "Other",        label: "Other Location (see Notes)"},
    { value: "Returned",     label: "Kindle Unlimited (Returned)"},
    { value: "Unlimited",    label: "Kindle Unlimited (Checked Out)"},
    { value: "Watch",        label: "Not yet purchased or downloaded"},
];

export const validateVolumeType = (type: string | null | undefined): boolean => {
    if (!type) {
        return true;
    } else {
        for (const validVolumeType of VALID_VOLUME_TYPES) {
            if (validVolumeType.value === type) {
                return true;
            }
        }
        return false;
    }
}

export const VALID_VOLUME_TYPES: SelectOption[] = [
    { value: "Single",     label: "Single Story by Volume Author(s)"},
    { value: "Collection", label: "Collection by Volume Author(s)"},
    { value: "Anthology",  label: "Anthology by Different Author(s)"},
];
