// Database ------------------------------------------------------------------

// Set up database integration and return a configured Sequelize object.

// External Modules ----------------------------------------------------------

require("custom-env").env(true);
import { Sequelize } from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import AuthorStory from "./AuthorStory";
import Library from "./Library";
import Story from "./Story";

import OAuthAccessToken from "../oauth/OAuthAccessToken";
import OAuthRefreshToken from "../oauth/OAuthRefreshToken";
import OAuthUser from "../oauth/OAuthUser";

// Configure Database instance ----------------------------------------------

const DB_DB: string = process.env.DB_DB || "";
const DB_HOST: string = process.env.DB_HOST || "";
const DB_PASSWORD: string = process.env.DB_PASSWORD || "";
const DB_POOL_ACQUIRE: string = process.env.DB_POOL_ACQUIRE || "30000";
const DB_POOL_IDLE: string = process.env.DB_POOL_ACQUIRE || "10000";
const DB_POOL_MAX: string = process.env.DB_POOL_ACQUIRE || "5";
const DB_POOL_MIN: string = process.env.DB_POOL_ACQUIRE || "0";
const DB_USER: string = process.env.DB_USER || "";
const NODE_ENV: string = process.env.NODE_ENV || "production";

export const Database = ((NODE_ENV !== "test")
        ? new Sequelize(DB_DB, DB_USER, DB_PASSWORD, {
            dialect: "postgres",
            host: DB_HOST,
            // logging: console.info,
            logging: false,
            pool: {
                acquire: parseInt(DB_POOL_ACQUIRE),
                idle: parseInt(DB_POOL_IDLE),
                max: parseInt(DB_POOL_MAX),
                min: parseInt(DB_POOL_MIN),
            }
        })
        : new Sequelize("database", "username", "password", {
                dialect: "sqlite",
                // logging: console.info,
                logging: false,
                storage: "./test/database.sqlite",
            }
        )
);

Database.addModels([
    // Application specific models
    Author,
    AuthorStory,
    Library,
    Story,
    // OAuth2 integration models
    OAuthAccessToken,
    OAuthRefreshToken,
    OAuthUser,
]);

// Export completed database configuration -----------------------------------

export default Database;
