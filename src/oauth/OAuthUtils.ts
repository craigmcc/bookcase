// OAuthUtils ----------------------------------------------------------------

// General utilities for the OAuth Orchestrator implementation.

// External Modules ----------------------------------------------------------

import crypto, { randomBytes } from "crypto";

// Public Objects ------------------------------------------------------------

/**
 * Generate and return a random token.
 */
export const generateRandomToken = (): string => {
    const buffer: Buffer = crypto.randomBytes(256);
    return buffer.toString("hex");
}

