// server --------------------------------------------------------------------

// Overall Express server for the Bookcase application.

// External Modules ----------------------------------------------------------

import bodyParser from "body-parser";
import cors from "cors";
require("custom-env").env(true);
import express from "express";
import morgan from "morgan";

// Internal Modules ----------------------------------------------------------

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


// Configure Express Middleware

const app = express();

console.info("Configure Express Middleware: Starting");
app.use(bodyParser.json());
app.use(bodyParser.text({
    limit: "2mb",
    type: "text/csv",
}))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors({
    origin: "*"
}));
app.use(morgan(
    process.env.NODE_ENV === "development" ? "dev" : "combined"));
console.info("Configure Express Middleware: Complete");

// Configure Express API Routes

console.info("Configure Express API Routes: Starting");
// TODO
console.info("Configure Express API Routes: Complete");

// Configure Static File Routing (will go to React app(s))

console.info("Configure Express Static Routes: Starting");
app.get("/", (req, res) => {
    res.send("Welcome to the Bookcase Server!");
});
console.info("Configure Express Static Routes: Complete");

// Start Server --------------------------------------------------------------

app.listen(process.env.PORT, () => {
    console.info
    (`Bookcase Server in ${process.env.NODE_ENV} mode running on port ${process.env.PORT}`);
});
