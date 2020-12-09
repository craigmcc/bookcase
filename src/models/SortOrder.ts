// SortOrder -----------------------------------------------------------------

// Standard "order" values for each defined Model

// External Modules ----------------------------------------------------------

import { Order } from "sequelize";

// Public Objects ------------------------------------------------------------

export const Authors: Order  = [
    [ "libraryId", "ASC" ],
    [ "lastName", "ASC" ],
    [ "firstName", "ASC" ],
];

export const Libraries: Order = [
    [ "name", "ASC" ],
];

export const Stories: Order = [
    [ "libraryId", "ASC" ],
    [ "name", "ASC" ],
];

