// actions/LibraryActions.test.ts

/**
 *  Functional tests for LibraryActions.
 *
 *  @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
import {
    Library,
    Prisma,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "./LibraryActions";
import ActionsUtils from "@/test/ActionsUtils";
import * as SeedData from "@/test/SeedData";
import {BadRequest, NotFound, NotUnique} from "@/util/HttpErrors";

const UTILS = new ActionsUtils();

// Test Specifications -------------------------------------------------------

describe("LibraryActions Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach(async () => {
        await UTILS.loadData({
            withAuthors: true,
            withLibraries: true,
            withSeries: true,
            withStories: true,
            withVolumes: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("LibraryActions.all()", () => {

        it("should pass on active Libraries", async () => {
            const INPUTS =
                await LibraryActions.all({ active: true });
            for (const INPUT of INPUTS) {
                expect(INPUT.active).to.be.true;
            }
        });

        it("should pass on all Libraries", async () => {
            const INPUTS = await LibraryActions.all();
            expect(INPUTS.length).to.equal(SeedData.LIBRARIES.length);
        });

        it("should pass on included children", async () => {
            const INPUTS =
                await LibraryActions.all({
                    withAuthors: true,
                    withSeries: true,
                    withStories: true,
                    withVolumes: true,
                });
            for (const INPUT of INPUTS) {
                if (INPUT.name !== SeedData.LIBRARY_NAME_THIRD) {
                    expect(INPUT.authors.length).to.be.greaterThan(0);
                    expect(INPUT.series.length).to.be.greaterThan(0);
                    expect(INPUT.stories.length).to.be.greaterThan(0);
                    expect(INPUT.volumes.length).to.be.greaterThan(0);
                }
            }
        });

        it("should pass on named libraries", async () => {
            const PATTERN = "iBr";
            const OUTPUTS =
                await LibraryActions.all({ name: PATTERN});
            expect(OUTPUTS.length).to.be.greaterThan(0);
            for (const OUTPUT of OUTPUTS) {
                expect(OUTPUT.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            }
        });

        it("should pass on paginated libraries", async () => {
            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await LibraryActions.all();
            const OUTPUTS = await LibraryActions.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(SeedData.LIBRARIES.length - 1);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareLibraryOld(OUTPUT, INPUTS[index + OFFSET]);
            });
        });

    });

    // TODO: LibraryActions.authors()

    describe("LibraryActions.exact()", () => {

        it("should fail on invalid name", async () => {
            const INVALID_NAME = "INVALID LIBRARY NAME";
            try {
                await LibraryActions.exact(INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing Library '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid names", async () => {
            for (const INPUT of SeedData.LIBRARIES) {
                try {
                    const OUTPUT =
                        await LibraryActions.exact(INPUT.name);
                    expect(OUTPUT.name).to.equal(INPUT.name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("LibraryActions.find()", () => {

        it("should fail on invalid id", async () => {
            const INVALID_ID = 9999;
            try {
                await LibraryActions.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing Library ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on included relations", async () => {
            const INPUTS = await LibraryActions.all();
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await LibraryActions.find(INPUT.id, {
                            withAuthors: true,
                            withSeries: true,
                            withStories: true,
                            withVolumes: true,
                        });
                    if (OUTPUT.name !== SeedData.LIBRARY_NAME_THIRD) {
                        expect(OUTPUT.authors.length).to.be.greaterThan(0);
                        expect(OUTPUT.series.length).to.be.greaterThan(0);
                        expect(OUTPUT.stories.length).to.be.greaterThan(0);
                        expect(OUTPUT.volumes.length).to.be.greaterThan(0);
                    }
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}`);
                }
            }
        });

        it("should pass on valid ids", async () => {
            const INPUTS = await LibraryActions.all();
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await LibraryActions.find(INPUT.id);
                    compareLibraryOld(OUTPUT, INPUT);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("LibraryActions.insert()", () => {

        it("should fail on duplicate name", async () => {
            const INPUT: Prisma.LibraryCreateInput = {
                name: SeedData.LIBRARIES[0].name,
                scope: "validscope",
            }
            try {
                await LibraryActions.insert(INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`name: Library name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should fail on duplicate scope", async () => {
            const INPUT: Prisma.LibraryCreateInput = {
                name: "Valid Name",
                scope: SeedData.LIBRARIES[0].scope,
            }
            try {
                await LibraryActions.insert(INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`scope: Library scope '${INPUT.scope}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should fail on invalid input data", async () => {
            const INPUT: Prisma.LibraryCreateInput = {
                name: "Valid Name",
                scope: "invalid scope",
            }
            try {
                await LibraryActions.insert(INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                    (`scope: Scope '${INPUT.scope}' must not contain spaces`);
                } else {
                    expect.fail(`Should not have thrown '${error}`);
                }
            }
        });

        it("should pass on valid input data", async () => {
            const INPUT: Prisma.LibraryCreateInput = {
                active: false,
                name: "Valid Name",
                notes: "Valid notes",
                scope: "validscope",
            }
            const OUTPUT = await LibraryActions.insert(INPUT);
            compareLibraryNew(OUTPUT, INPUT as Library);
        });

    });

    describe("LibraryActions.remove()", () => {

        it("should fail on invalid ID", async () => {
            const INVALID_ID = -1;
            try {
                await LibraryActions.remove(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`id: Missing Library ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid ID", async () => {
            const INPUT = await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const OUTPUT = await LibraryActions.remove(INPUT.id);
            compareLibraryOld(OUTPUT, INPUT);
            try {
                await LibraryActions.remove(INPUT.id);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`id: Missing Library ${INPUT.id}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    // TODO: LibraryActions.series()

    // TODO: LibraryActions.stories()

    describe("LibraryActions.update()", () => {

        it("should fail on duplicate name", async () => {
            const ORIGINAL =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUT: Prisma.LibraryUpdateInput = {
                name: SeedData.LIBRARY_NAME_SECOND,
            }
            try {
                await LibraryActions.update(ORIGINAL.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`name: Library name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should fail on duplicate scope", async () => {
            const ORIGINAL =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const INPUT: Prisma.LibraryUpdateInput = {
                scope: SeedData.LIBRARY_SCOPE_SECOND,
            }
            try {
                await LibraryActions.update(ORIGINAL.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`scope: Library scope '${INPUT.scope}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on no change update", async () => {
            const INPUT =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const UPDATE: Prisma.LibraryUpdateInput = {
                active: INPUT.active,
                name: INPUT.name,
                notes: INPUT.notes,
                scope: INPUT.scope,
            }
            try {
                const OUTPUT = await LibraryActions.update(INPUT.id, UPDATE);
                compareLibraryOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on no data update", async () => {
            const INPUT =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const UPDATE: Prisma.LibraryUpdateInput = {};
            try {
                const OUTPUT = await LibraryActions.update(INPUT.id, UPDATE);
                compareLibraryOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on valid change update", async () => {
            const INPUT =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const UPDATE: Prisma.LibraryUpdateInput = {
                active: INPUT.active ? !INPUT.active : undefined,
                name: INPUT.name + " New",
                notes: INPUT.notes ? INPUT.notes + " new" : "New Note Value",
                scope: INPUT.scope + "new",
            }
            try {
                const OUTPUT = await LibraryActions.update(INPUT.id, UPDATE);
                compareLibraryOld(OUTPUT, UPDATE as Library);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

    });

    // TODO: LibraryActions.volumes()

});

// Private Objects -------------------------------------------------------

export function compareLibraryNew(OUTPUT: Library, INPUT: Library) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope);
}

export function compareLibraryOld(OUTPUT: Library, INPUT: Library) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
}

