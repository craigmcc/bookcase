// AxiosClient ---------------------------------------------------------------

// Basic infrastructure for Axios interactions with a remote server, configured
// with a base URL based on the REACT_APP_NODE_ENV environment variable.

// External Modules ----------------------------------------------------------

import axios from "axios";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export default axios.create({
    baseURL: baseURL(),
    headers: {
        "Content-Type": "application/json",
    },
});

// Private Objects -----------------------------------------------------------

function baseURL(): string {
    const nodeEnv: string = process.env.NODE_ENV;
    console.info(`Configuring remote server for ${nodeEnv} mode`);
    switch (nodeEnv) {
        case "development":
            // client/package.json needs "proxy": "http://localhost:8081"
            // server needs to route requests with this prefix
            return "/api";
        case "test":
            return "http://localhost:8081/api";
        case "production":
            // server needs to route requests with this prefix
            return "/api";
        default:
            return "http://localhost:8081/api";
    }
}
