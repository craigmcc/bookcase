// util/Models.ts

/**
 * Predicates to check the type of specified Parent model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Parent} from "@/types/types";

// Public Objects ------------------------------------------------------------

/**
 * Is this Parent an Author?
 */
export function isAuthor(parent: Parent): boolean {
    // @ts-ignore
    const _model = parent._model;
    return _model === "Author";
}

/**
 * Is this Parent a Library?
 */
export function isLibrary(parent: Parent): boolean {
    // @ts-ignore
    const _model = parent._model;
    return _model === "Library";
}

/**
 * Is this Parent a Series?
 */
export function isSeries(parent: Parent): boolean {
    // @ts-ignore
    const _model = parent._model;
    return _model === "Series";
}

/**
 * Is this Parent a Story?
 */
export function isStory(parent: Parent): boolean {
    // @ts-ignore
    const _model = parent._model;
    return _model === "Story";
}

/**
 * Is this Parent a Volume?
 */
export function isVolume(parent: Parent): boolean {
    // @ts-ignore
    const _model = parent._model;
    return _model === "Volume";
}
