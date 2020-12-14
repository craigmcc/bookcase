// OAuthUtils ----------------------------------------------------------------

// General utilities for the OAuth Orchestrator implementation.

// External Modules ----------------------------------------------------------

import crypto, { randomBytes } from "crypto";
import util from "util";

// Internal Modules ----------------------------------------------------------

const promisifiedRandomBytes = util.promisify(crypto.randomBytes);

// Public Objects ------------------------------------------------------------

/**
 * Generate and return a random token, with an optional specified length
 * in bytes, converted to hex encoding.
 *
 * @param desiredSize Desired number of bytes (hex will be this * 4 in length)
 */

export const generateRandomToken = async (desiredSize: number = 63): Promise<string> => {
    const buffer: Buffer = await promisifiedRandomBytes(desiredSize);
    return buffer.toString("hex");
}

/**
 * Generate and return a random token.
 */
export const generateRandomTokenSync = (): string => {
    const buffer: Buffer = crypto.randomBytes(63);
    return buffer.toString("hex");
}
