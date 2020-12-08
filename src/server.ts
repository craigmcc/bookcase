// server --------------------------------------------------------------------

// Overall Express server for the Bookcase application.

// External Modules ----------------------------------------------------------

import bodyParser from "body-parser";
import cors from "cors";
require("custom-env").env(true);
import express from "express";
import morgan from "morgan";

// Internal Modules ----------------------------------------------------------

// Configuration Processing --------------------------------------------------

// Configure Models and Associations

// TODO

// Synchronize Database Metadata

// TODO

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
