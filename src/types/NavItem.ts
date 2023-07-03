// types/NavItem.ts

/**
 * Navigation item for site configuration information.
 *
 * @packageDocumentation
 */
export interface NavItem {
    // Is this navigation item disabled?
    disabled?: boolean,
    // Does this navigation item point at an external site?
    external?: boolean,
    // URL executed when this navigation item is executed
    href?: string,
    // Display title of this navigation item
    title: string,
}
