// server --------------------------------------------------------------------

// Overall Express server for the Bookcase application.

// External Modules ----------------------------------------------------------

require("custom-env").env(true);

// Internal Modules ----------------------------------------------------------

import ExpressServer from "./controllers/ExpressServer";
import Author from "./models/Author";
import AuthorStory from "./models/AuthorStory";
import Database from "./models/Database";
import Library from "./models/Library";
import Story from "./models/Story";

// Configuration Processing --------------------------------------------------

// Configure Models and Associations

console.info("Configure Sequelize Models: Starting");
console.info(`  Dialect: ${Database.getDialect()}`);
Database.addModels([
    Author,
    AuthorStory,
    Library,
    Story,
]);
console.info("Configure Sequelize Models: Complete");

// Synchronize Database Metadata

console.info("Configure Database Metadata: Starting");
const force: boolean = (!!process.env.SYNC_FORCE);
console.info(`  Sync force: ${force}`);
Database.sync({
    force: force
});
console.info("Configure Database Metadata: Complete");

// Configure and Start Server ------------------------------------------------

console.info("Configure Express Server: Starting");
const expressServer = new ExpressServer();
console.info("Configure Express Server: Complete");

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
expressServer.start(port);
