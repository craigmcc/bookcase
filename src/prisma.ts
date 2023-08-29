
// prisma.ts

/**
 * Create a configured instance of the client for Prisma.  This should be
 * used as a singleton throughout the application.
 */

// External Modules ----------------------------------------------------------

//import "server-only";
import { PrismaClient } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import logger from "./util/ServerLogger";

// Public Objects ------------------------------------------------------------

// TODO - support overriding things like datasources/db/url somehow
const prisma = new PrismaClient({
//    log: [ "query", "info", "warn", "error"],
})
    .$extends({
        result: {
            library: {
                _model: {
                    compute(library) { return "Library" }
                }
            }
        }
    });
let database = "UNKNOWN";
if (process.env.DATABASE_URL) {
    // NOTE: assumes a traditional DATABASE_URL format
    const splits = process.env.DATABASE_URL.split("/");
    if (splits.length > 0) {
        database = splits[splits.length - 1];
    }
}
logger.info({
    context: "Startup",
    msg: "Prisma client initialized",
    database: database,
})

export default prisma;
