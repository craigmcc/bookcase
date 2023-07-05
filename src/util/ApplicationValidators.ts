// util/ApplicationValidators -----------------------------------------------------

/**
 * Application specific validators that do not require database access, and are
 * therefore not async functions.  In all cases, a "true" return indicates that
 * the proposed value is valid, while "false" means it is not.  If a field is
 * required, that must be validated separately.
 *
 * @packageDocumentation
 */

// Public Objects -----------------------------------------------------------

export const validateLibraryScope = (scope: string | undefined): boolean => {
    if (!scope || (scope.length === 0)) {
        return true;
    }
    return scope.match(LIBRARY_SCOPE_PATTERN) !== null;
}

export const validateVolumeLocation = (location: string | null | undefined): boolean => {
    if (!location) {
        return true;
    } else {
        return VALID_VOLUME_LOCATIONS.has(location);
    }
}

export const LIBRARY_SCOPE_PATTERN: RegExp = /^[a-zA-Z0-9]+$/;

export const VALID_VOLUME_LOCATIONS: Map<string, string> = new Map();
VALID_VOLUME_LOCATIONS.set("Box",           "Book in a Box (see Notes)");
VALID_VOLUME_LOCATIONS.set("Computer",      "Computer Downloads (PDF)");
VALID_VOLUME_LOCATIONS.set("Kindle",        "Kindle Download (Purchased)");
VALID_VOLUME_LOCATIONS.set("Kobo",          "Kobo Download (Purchased)");
VALID_VOLUME_LOCATIONS.set("Other",         "Other Location (See Notes");
VALID_VOLUME_LOCATIONS.set("Returned",      "Kindle Unlimited (Returned)");
VALID_VOLUME_LOCATIONS.set("Unlimited",     "Kindle Unlimited (Checked Out)");
VALID_VOLUME_LOCATIONS.set("Watch",         "Not Yet Purchased or Downloaded");

export const validateVolumeType = (type: string | null | undefined): boolean => {
    if (!type) {
        return true;
    } else {
        return VALID_VOLUME_TYPES.has(type);
    }
}

export const VALID_VOLUME_TYPES: Map<string, string> = new Map();
VALID_VOLUME_TYPES.set("Single",            "Single Story by Volume Author(s)");
VALID_VOLUME_TYPES.set("Collection",        "Collection by Volume Authors(s)");
VALID_VOLUME_TYPES.set("Anthology",         "Anthology by different Author(s)");
