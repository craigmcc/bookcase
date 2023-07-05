// types/types.d.ts

/**
 * Generic types common to this entire application.
 */

/**
 * The options for "all" requests that perform pagination.
 */
export type PaginationOptions = {
    // The maximum number of rows to return for this request.
    limit?: number;
    // The zero-relative offset to the first row to be returned.
    offset?: number;
}
