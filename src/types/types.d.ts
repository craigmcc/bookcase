// types/types.d.ts

/**
 * Generic types common to this entire application.
 *
 * @packageDocumentation
 */

import {AuthorPlus} from "@/types/models/Author";
import {LibraryPlus} from "@/types/models/Library";
import {SeriesPlus} from "@/types/models/Series";
import {StoryPlus} from "@/types/models/Story";
import {VolumePlus} from "@/types/models/Volume";

/**
 * Application level handler for an action (such as a button click)
 */
export type HandleAction = () => void;

/**
 * Application level handler for a new boolean value from an input element.
 */
export type HandleBoolean = (newBoolean: boolean) => void;


/**
 * Application level handler for a new string value from an input element.
 */
export type HandleString = (newValue: string) => void;

/**
 * HTML event handler for a changed value from an input element.
 */
export type OnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => void;

/**
 * HTML event handler for a click on an HTML element.
 */
export type OnClick = (event: React.MouseEvent<HTMLElement>) => void;

/**
 * HTML event handler for a "key down" event on an HTML element.
 */
export type OnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => void;

/**
 * The options for "all" requests that perform pagination.
 */
export type PaginationOptions = {
    // The maximum number of rows to return for this request.
    limit?: number;
    // The zero-relative offset to the first row to be returned.
    offset?: number;
}

/**
 * Union of models that can be a "parent" in a parent-child relationship.
 */
export type Parent = AuthorPlus | LibraryPlus | SeriesPlus | StoryPlus | VolumePlus;

/**
 * The options offered by a Select input control.
 */
type SelectOption = {
    label: string;                      // Label displayed for this option
    value: string;                      // Value returned when this option is selected
}
