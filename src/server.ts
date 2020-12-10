// server --------------------------------------------------------------------

// Overall Express server for the Bookcase application.

// External Modules ----------------------------------------------------------

import {Logger} from "@overnightjs/logger";

require("custom-env").env(true);

// Internal Modules ----------------------------------------------------------

//import ExpressServer from "./controllers/ExpressServer";
import Author from "./models/Author";
import AuthorStory from "./models/AuthorStory";
import Database from "./models/Database";
import Library from "./models/Library";
import Story from "./models/Story";
import ExpressServer from "./routers/ExpressApplication";
import ExpressApplication from "./routers/ExpressApplication";
import app from "./routers/ExpressApplication";

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

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
//expressServer.start(port);
ExpressApplication.listen(port, () => {
    Logger.Imp(
        `Bookcase Server in ${process.env.NODE_ENV} mode running on port ${port}`
    )
});

