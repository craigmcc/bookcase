// actions/UserActions.test.ts

/**
 * Functional tests for UserActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
import {
    Prisma,
    User,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as UserActions from "./UserActions";
import ActionUtils from "@/test/ActionsUtils";
import * as SeedData from "@/test/SeedData";
import {NotFound, NotUnique} from "@/util/HttpErrors";

const UTILS = new ActionUtils();

// Test Specifications -------------------------------------------------------

describe("UserActions Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach(async () => {
        await UTILS.loadData({
            withUsers: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("UserActions.all()", () => {

        it("should pass on active Users", async () => {
            const INPUTS =
                await UserActions.all({ active: true });
            for (const INPUT of INPUTS) {
                expect(INPUT.active).to.be.true;
            }
        });

        it("should pass on all Users", async () => {
            const INPUTS = await UserActions.all();
            expect(INPUTS.length).to.equal(SeedData.USERS.length);
        });

        it("should pass on named users", async () => {
            const PATTERN = "AdM"; // Should match "admin"
            const OUTPUTS =
                await UserActions.all({ username: PATTERN});
            expect(OUTPUTS.length).to.be.greaterThan(0);
            for (const OUTPUT of OUTPUTS) {
                expect(OUTPUT.username.toLowerCase()).to.include(PATTERN.toLowerCase());
            }
        });

        it("should pass on paginated users", async () => {
            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await UserActions.all();
            const OUTPUTS = await UserActions.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(SeedData.USERS.length - 1);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareUserOld(OUTPUT, INPUTS[index + OFFSET]);
            });
        });


    });

    describe("UserActions.exact()", () => {

        it("should fail on invalid username", async () => {
            const INVALID_USERNAME = "INVALID USER USERNAME";
            try {
                await UserActions.exact(INVALID_USERNAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing User '${INVALID_USERNAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid usernames", async () => {
            for (const INPUT of SeedData.USERS) {
                try {
                    const OUTPUT =
                        await UserActions.exact(INPUT.username);
                    expect(OUTPUT.username).to.equal(INPUT.username);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("UserActions.find()", () => {

        it("should fail on invalid id", async () => {
            const INVALID_ID = 9999;
            try {
                await UserActions.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing User ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid ids", async () => {
            const INPUTS = await UserActions.all();
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await UserActions.find(INPUT.id);
                    compareUserOld(OUTPUT, INPUT);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("UserActions.insert()", () => {

        it("should fail on duplicate username", async () => {
            const INPUT: Prisma.UserCreateInput = {
                name: SeedData.USERS[0].name,
                password: SeedData.USERS[0].password,
                scope: "validscope",
                username: SeedData.USERS[0].username,
            }
            try {
                await UserActions.insert(INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`username: User username '${INPUT.username}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid input data", async () => {
            const INPUT: Prisma.UserCreateInput = {
                active: false,
                google_books_api_key: null,
                password: "password",
                name: "Valid Name",
                username: "username",
                scope: "validscope",
            }
            const OUTPUT = await UserActions.insert(INPUT);
            compareUserNew(OUTPUT, INPUT as User);
        });

    });

    describe("UserActions.remove()", () => {

        it("should fail on invalid ID", async () => {
            const INVALID_ID = -1;
            try {
                await UserActions.remove(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`id: Missing User ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid ID", async () => {
            const INPUT = await UserActions.exact(SeedData.USER_USERNAME_FIRST_REGULAR);
            const OUTPUT = await UserActions.remove(INPUT.id);
            compareUserOld(OUTPUT, INPUT);
            try {
                await UserActions.remove(INPUT.id);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`id: Missing User ${INPUT.id}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("UserActions.update()", () => {

        it("should fail on duplicate username", async () => {
            const ORIGINAL =
                await UserActions.exact(SeedData.USER_USERNAME_FIRST_REGULAR);
            const INPUT: Prisma.UserUpdateInput = {
                username: SeedData.USER_USERNAME_SECOND_REGULAR,
            }
            try {
                await UserActions.update(ORIGINAL.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`username: User username '${INPUT.username}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on no change update", async () => {
            const INPUT =
                await UserActions.exact(SeedData.USER_USERNAME_FIRST_ADMIN);
            const UPDATE: Prisma.UserUpdateInput = {
                active: INPUT.active,
                google_books_api_key: INPUT.google_books_api_key,
                name: INPUT.name,
                password: INPUT.password,
                scope: INPUT.scope,
                username: INPUT.username,
            }
            try {
                const OUTPUT =
                    await UserActions.update(INPUT.id, UPDATE);
                compareUserOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on no data update", async () => {
            const INPUT =
                await UserActions.exact(SeedData.USER_USERNAME_SECOND_REGULAR);
            const UPDATE: Prisma.UserUpdateInput = {};
            try {
                const OUTPUT =
                    await UserActions.update(INPUT.id, UPDATE);
                compareUserOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on valid change update", async () => {
            const INPUT =
                await UserActions.exact(SeedData.USER_USERNAME_FIRST_ADMIN);
            const UPDATE: Prisma.UserUpdateInput = {
                active: INPUT.active ? !INPUT.active : undefined,
                name: INPUT.name + " New",
                scope: INPUT.scope + "new",
                username: INPUT.username + "new",
            }
            try {
                const OUTPUT =
                    await UserActions.update(INPUT.id, UPDATE);
                compareUserOld(OUTPUT, UPDATE as User);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

    });

});

// Private Objects -------------------------------------------------------

export function compareUserNew(OUTPUT: User, INPUT: User) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.google_books_api_key).to.equal(INPUT.google_books_api_key);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.password).to.equal(""); // Redacted
    expect(OUTPUT.scope).to.equal(INPUT.scope);
    expect(OUTPUT.username).to.equal(INPUT.username);
}

export function compareUserOld(OUTPUT: User, INPUT: User) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.google_books_api_key).to.equal(INPUT.google_books_api_key ? INPUT.google_books_api_key : OUTPUT.google_books_api_key);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.password).to.equal(""); // Redacted
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
    expect(OUTPUT.username).to.equal(INPUT.username ? INPUT.username : OUTPUT.username);
}

