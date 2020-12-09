// query-parameters ----------------------------------------------------------

// Utility methods for appending to Sequelize options based on query parameters.

// External Modules ----------------------------------------------------------

import { FindOptions } from "sequelize";
import { Model } from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import Story from "../models/Story";
import {Includeable} from "sequelize/types/lib/model";

// Public Functions ----------------------------------------------------------

/**
 * Append standard pagination query parameters (if present), and return the
 * updated options.
 */
export const appendPagination = (options: FindOptions, query: any): FindOptions => {
    if (query.limit) {
        let value = parseInt(query.limit, 10);
        if (isNaN(value)) {
            throw new Error(`limit: '${query.limit}' is not a number`);
        } else {
            options.limit = value;
        }
    }
    if (query.offset) {
        let value = parseInt(query.offset, 10);
        if (isNaN(value)) {
            throw new Error(`offset: '${query.offset}' is not a number`);
        } else {
            options.offset = value;
        }
    }
    return options;
}
