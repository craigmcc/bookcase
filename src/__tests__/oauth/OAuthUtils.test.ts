// OAuthUtil.test ------------------------------------------------------------

// Tests for OAuthUtil utility functions.

// External Modules -----------------------------------------------------------

const chai = require("chai");
import { hashPassword, verifyPassword } from "../../oauth/OAuthUtils";

const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

// Test Suites ---------------------------------------------------------------

describe("hashPassword()/verifyPassword()", () => {

    it("should fail on mismatched password", async () => {

        const realPassword:string = "testpassword";
        let realHash:string = "";
        try {
            realHash = await hashPassword(realPassword);
        } catch (error) {
            expect.fail("Hash timeout exceeded: " + JSON.stringify(error));
        }
        console.info(`Hash for ${realPassword} is ${realHash} (${realHash.length})`);

        const testPassword:string = "differentpassword";
        let result: boolean = false;
        try {
            result = await verifyPassword(testPassword, realHash);
            expect(result).equals(false);
        } catch (error) {
            expect.fail("Verify timeout exceeded: " + JSON.stringify(error));
        }

    })

    it("should pass on matched password", async () => {

        const realPassword:string = "testpassword";
        let realHash:string = "";
        try {
            realHash = await hashPassword(realPassword);
        } catch (error) {
            expect.fail("Hash timeout exceeded: " + JSON.stringify(error));
        }
        console.info(`Hash for ${realPassword} is ${realHash} (${realHash.length})`);

        const testPassword:string = realPassword;
        let result: boolean = false;
        try {
            result = await verifyPassword(testPassword, realHash);
            expect(result).equals(true);
        } catch (error) {
            expect.fail("Verify timeout exceeded: " + JSON.stringify(error));
        }

    })

})
