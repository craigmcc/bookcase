// util/BreadcrumbUtils.ts

/**
 * Utility methods to manipulate the stored BreadcrumbItem data for this
 * application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import LocalStorage from "@/util/LocalStorage";

// Public Objects ------------------------------------------------------------

/**
 * The local storage key for our BreadcrumbItem array.
 */
export const BREADCRUMBS_KEY = "BREADCRUMBS";

/**
 * An individual item for the Breadcrumbs component (and associated storage).
 */
export type BreadcrumbItem = {
    /**
     * The site-relative URL to return to if this item is selected.
     */
    href: string;
    /**
     * The textual label for this item when it is displayed.
     */
    label: string;

}

/**
 * The local storage declaration for our BreadcrumbItem array.
 */
export const BreadcrumbLocalStorage =
    new LocalStorage<BreadcrumbItem[]>(BREADCRUMBS_KEY);

/**
 * Append the specified BreadcrumbItem to our local storage.
 *
 * @param item                          BreadcrumbItem to be appended
 *
 * @returns                             The updated BreadcrumbItem array
 */
export function add(item: BreadcrumbItem): BreadcrumbItem[] {
    //console.log("add.item", JSON.stringify(item));
    const items = BreadcrumbLocalStorage.value;
    //console.log("add.before", JSON.stringify(items));
    items.push(item);
    //console.log("add.after", JSON.stringify(items));
    BreadcrumbLocalStorage.value = items;
    return items;
}

/**
 * Clear the existing BreadcrumbItem array.
 *
 * @returns                             The newly empty BreadcrumbItem array
 */
export function clear(): BreadcrumbItem[] {
    let items = BreadcrumbLocalStorage.value;
    //console.log("clear.before", JSON.stringify(items));
    items = [];
    //console.log("clear.after", JSON.stringify(items));
    BreadcrumbLocalStorage.value = items;
    return items;
}

/**
 * Return the current BreadcrumbItem array.
 *
 * @returns                             The current BreadcrumbItem array
 */
export function current(): BreadcrumbItem[] {
    const items = BreadcrumbLocalStorage.value;
    //console.log("current", JSON.stringify(items));
    return items;
}

/**
 * Trim trailing BreadcrumbItem items down to, but NOT including, the item
 * with the specified href value.
 *
 * @param href                          The href of the last trailing item to remove
 *
 * @returns                             The updated BreadcrumbItem array
 */
export function trim(href: string): BreadcrumbItem[] {
    let items = BreadcrumbLocalStorage.value;
    //console.log("trim.before", JSON.stringify(items));
    //console.log("trim.href", href);
    while (items.length > 0) {
        const item = items[items.length - 1];
        if (item.href === href) {
            break;
        }
        items = items.slice(0, -1);
    }
    //console.log("trim.after ", JSON.stringify(items));
    BreadcrumbLocalStorage.value = items;
    return items;
}
