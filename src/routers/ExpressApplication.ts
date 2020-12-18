// ExpressApplication --------------------------------------------------------

// Overall Express application, configured as a Javascript class.

// WARNING: There is only one top level express() object in an application.
// Express lets you add sub-applications to an application, but you can
// do pretty much everything that would provide by adding routers.

// It is presumed that detailed app.use() configuration will happen at the
// router level, rather than here, with the routers then added.

// External Modules ----------------------------------------------------------

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import {
    handleHttpError,
    handleServerError,
    handleValidationError
} from "../util/middleware";
import ApiRouters from "./ApiRouters";
import OAuthRouters from "../oauth/OAuthRouters";
import { handleOAuthError } from "../oauth/OAuthMiddleware";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

const app = express();

// Configure global middleware
app.use(cors({
    origin: "*"
}));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// Configure body handling middleware
app.use(bodyParser.json({
}));
app.use(bodyParser.text({
    limit: "2mb",
    type: "text/csv",
}));
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Configure static file routing
const CLIENT_BASE: string = path.resolve("./") + "/client/build";
console.info("Static File Path: " + CLIENT_BASE);
app.use(express.static(CLIENT_BASE));

// Configure application-specific and OAuth-specific routing
app.use("/api", ApiRouters);
app.use("/oauth", OAuthRouters);

// Configure error handling (must be last)
app.use(handleHttpError);
app.use(handleValidationError);
app.use(handleOAuthError);
app.use(handleServerError); // The last of the last :-)

// Configure unknown mappings back to client
app.get("*", (req, res) => {
    res.sendFile(CLIENT_BASE + "/index.html");
})

export default app;
