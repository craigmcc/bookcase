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
            return "http://localhost:8080/api";
        case "test":
            return "http://localhost:8080/api";
        case "production":
            return "/api";
        default:
            return "http://localhost:8080/api";
    }
/*
    let nodeEnv = process.env.REACT_APP_NODE_ENV;
    console.info("Configuring remote server for "
        + (nodeEnv ? nodeEnv : "default") + " mode.");
    switch (nodeEnv) {
        case "development":
        case "test":
            return "http://localhost:8084/api";
        case "production":
        default:
            return "http://wildfly.hopto.org:8084/api";
    }
*/
    return "";
}
