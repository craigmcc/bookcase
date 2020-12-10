// server --------------------------------------------------------------------

// Overall Express server for the Bookcase application.

// External Modules ----------------------------------------------------------

require("custom-env").env(true);
import { OAuthServer } from "@craigmcc/basic-oauth2-server"

// Internal Modules ----------------------------------------------------------

import Database from "./models/Database";
import ExpressApplication from "./routers/ExpressApplication";
import { OAuthServerConfig } from "./oauth/OAuthServerConfig";

// Configuration Processing --------------------------------------------------

// Configure Models and Associations

console.info("Configure Sequelize Models: Starting");
console.info(`  Dialect: ${Database.getDialect()}`);
console.info("Configure Sequelize Models: Complete");

// Synchronize Database Metadata

console.info("Configure Database Metadata: Starting");
const force: boolean = (!!process.env.SYNC_FORCE);
console.info(`  Sync force: ${force}`);
Database.sync({
    force: force
});
console.info("Configure Database Metadata: Complete");

// Integrate OAuth2 Support

console.info("Configure OAuth2 Support: Starting");
ExpressApplication.locals.OAuthServer = new OAuthServer(OAuthServerConfig);
console.info(`  Access token lifetime: ${ExpressApplication.locals.OAuthServer.accessTokenLifetime}`);
console.info("Configure OAuth2 Support: Complete");

// Configure and Start Server ------------------------------------------------

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
ExpressApplication.listen(port, () => {
    console.log(
        `Bookcase Server in ${process.env.NODE_ENV} mode running on port ${port}`
    )
});

