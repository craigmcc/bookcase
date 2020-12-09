// ExpressServer -------------------------------------------------------------

// Express server instance configured with middleware and controllers.

// External Modules ----------------------------------------------------------

import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";

// Internal Modules ----------------------------------------------------------

import ApiController from "./ApiController";

// Public Objects ------------------------------------------------------------

export class ExpressServer extends Server {

    constructor() {
        super(process.env.NODE_ENV === "development");
        this.setupPreMiddleware();
        this.setupControllers();
        this.setupPostMiddleware();
        this.setupStaticRouting();
    }

    // Register top level controllers
    private setupControllers(): void {
        super.addControllers([
            new ApiController(),
        ]);
    }

    // Register middleware before setting up controllers
    private setupPreMiddleware(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.text({
            limit: "2mb",
            type: "text/csv",
        }));
        this.app.use(cors({
            origin: "*",
        }));
        this.app.use(morgan(
            process.env.NODE_ENV === "development" ? "dev" : "combined"
        ));
    }

    // Register middleware after setting up controllers
    private setupPostMiddleware(): void {
        // TODO - error handling?
    }

    // Register static routing for the embedded React application
    private setupStaticRouting(): void {
        // TODO - static routing
        this.app.get("/", (req, res) => {
            res.send("Welcome to the Bookcase Server!");
        })
    }

    // Start the server on the specified port
    public start(port: number): void {
        this.app.listen(port, () => {
            Logger.Imp(
                `Bookcase Server in ${process.env.NODE_ENV} mode running on port ${port}`
            )
        })
    }

}

export default ExpressServer;
