// actions/AuthorActions.test.ts

/**
 * Functional tests for AuthorActions
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
import {
    Author,
    Prisma,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "./AuthorActions";
import * as LibraryActions from "./LibraryActions";
import * as SeriesActions from "./SeriesActions";
import * as StoryActions from "./StoryActions";
//import * as VolumeActions from "./VolumeActions";
import ActionsUtils from "@/test/ActionsUtils";
import * as SeedData from "@/test/SeedData";
import {NotFound, NotUnique} from "@/util/HttpErrors";

const UTILS = new ActionsUtils();

// Test Specifications -------------------------------------------------------

describe("AuthorActions Functional Tests", () => {

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

    describe("AuthorActions.all()", () => {

        it("should pass on active Authors", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS =
                await AuthorActions.all(LIBRARY.id, { active: true });
            for (const INPUT of INPUTS) {
                expect(INPUT.active).to.be.true;
            }
        });

        it("should pass on all Authors", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS =
                await AuthorActions.all(LIBRARY.id);
            expect(INPUTS.length).to.equal(SeedData.AUTHORS_LIBRARY1.length);
        });

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS =
                await AuthorActions.all(LIBRARY.id, {
                    withLibrary: true,
                });
            expect(INPUTS.length).to.be.greaterThan(0);
            for (const INPUT of INPUTS) {
                expect(INPUT.library).to.exist;
                expect(INPUT.library.id).to.equal(LIBRARY.id);
            }
        });

        it("should pass on included relations", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await AuthorActions.all(LIBRARY.id, {
                withSeries: true,
                withStories: true,
                withVolumes: true,
            });
            for (const INPUT of INPUTS) {
                try {
                    expect(INPUT.authorsSeries).to.exist;
                    expect(INPUT.authorsStories).to.exist;
                    expect(INPUT.authorsVolumes).to.exist;
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on named Authors", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const PATTERN = "tT"; // Should match "Betty"
            const OUTPUTS =
                await AuthorActions.all(LIBRARY.id, { name: PATTERN });
            expect(OUTPUTS.length).to.be.greaterThan(0);
            for (const OUTPUT of OUTPUTS) {
                expect(OUTPUT.firstName.toLowerCase()).to.include(PATTERN.toLowerCase());
            }
        });

        it("should pass on paginated Authors", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await AuthorActions.all(LIBRARY.id);
            const OUTPUTS = await AuthorActions.all(LIBRARY.id, {
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(SeedData.AUTHORS_LIBRARY0.length - 1);
            OUTPUTS.forEach((OUTPUT, index) =>  {
                compareAuthorOld(OUTPUT, INPUTS[index + OFFSET]);
            });
        });

    });

    describe("AuthorActions.exact()", () => {

        it("should fail on invalid name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INVALID_FIRST_NAME = "INVALID FIRST NAME";
            const INVALID_LAST_NAME = "INVALID LAST NAME";
            try {
                await AuthorActions.exact(LIBRARY.id, INVALID_FIRST_NAME, INVALID_LAST_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing Author '${INVALID_FIRST_NAME} ${INVALID_LAST_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await AuthorActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await AuthorActions.exact(LIBRARY.id, INPUT.firstName, INPUT.lastName, {
                            withLibrary: true,
                        });
                    expect(OUTPUT.library).to.exist;
                    expect(OUTPUT.library.id).to.equal(LIBRARY.id);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on included relations", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await AuthorActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await AuthorActions.exact(LIBRARY.id, INPUT.firstName, INPUT.lastName, {
                            withSeries: true,
                            withStories: true,
                            withVolumes: true,
                        });
                    expect(OUTPUT.authorsSeries).to.exist;
                    expect(OUTPUT.authorsStories).to.exist;
                    expect(OUTPUT.authorsVolumes).to.exist;
                    expect(OUTPUT.authorsStories.length).to.be.greaterThan(0);
                    expect(OUTPUT.authorsSeries.length).to.be.greaterThan(0);
                    expect(OUTPUT.authorsVolumes.length).to.be.greaterThan(0);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid names", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await AuthorActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await AuthorActions.exact(LIBRARY.id, INPUT.firstName, INPUT.lastName);
                    expect(OUTPUT.firstName).to.equal(INPUT.firstName);
                    expect(OUTPUT.lastName).to.equal(INPUT.lastName);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("AuthorActions.find()", () => {

        it("should fail on invalid ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INVALID_ID = 9999;
            try {
                await AuthorActions.find(LIBRARY.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`id: Missing Author ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await AuthorActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await AuthorActions.find(LIBRARY.id, INPUT.id, {
                            withLibrary: true,
                        });
                    expect(OUTPUT.library).to.exist;
                    expect(OUTPUT.library.id).to.equal(LIBRARY.id);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on included relations", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS = await AuthorActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await AuthorActions.find(LIBRARY.id, INPUT.id, {
                            withSeries: true,
                            withStories: true,
                            withVolumes: true,
                        });
                    expect(OUTPUT.authorsSeries).to.exist;
                    expect(OUTPUT.authorsStories).to.exist;
                    expect(OUTPUT.authorsVolumes).to.exist;
                    expect(OUTPUT.authorsSeries.length).to.be.greaterThan(0);
                    expect(OUTPUT.authorsStories.length).to.be.greaterThan(0);
                    expect(OUTPUT.authorsVolumes.length).to.be.greaterThan(0);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid ids", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS =
                await AuthorActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await AuthorActions.find(LIBRARY.id, INPUT.id);
                    compareAuthorOld(OUTPUT, INPUT);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("AuthorActions.insert()", () => {

        it("should fail on duplicate name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withAuthors: true,
                });
            const INPUT: Prisma.AuthorUncheckedCreateInput = {
                libraryId: -1,          // Will get replaced
                firstName: LIBRARY.authors[0].firstName,
                lastName: LIBRARY.authors[0].lastName,
            }
            try {
                await AuthorActions.insert(LIBRARY.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`name: Author name '${INPUT.firstName} ${INPUT.lastName}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid input data", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withAuthors: true,
                });
            const INPUT: Prisma.AuthorUncheckedCreateInput = {
                active: false,
                firstName: LIBRARY.authors[0].firstName + " NEW",
                lastName: LIBRARY.authors[0].lastName + " NEW",
                libraryId: -1,          // Will get replaced
                notes: "Valid notes",
            }
            try {
                const OUTPUT =
                    await AuthorActions.insert(LIBRARY.id, INPUT);
                compareAuthorNew(OUTPUT, INPUT as Author, LIBRARY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

    });

    describe("AuthorActions.remove()", () => {

        it("should fail on invalid library ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withAuthors: true,
                });
            const INVALID_LIBRARY_ID = -1;
            const VALID_AUTHOR_ID = LIBRARY.authors[0].id;
            try {
                await AuthorActions.remove(INVALID_LIBRARY_ID, VALID_AUTHOR_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Author ${VALID_AUTHOR_ID}`);
            }
        });

        it("should fail on invalid author ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withAuthors: true,
                });
            const VALID_LIBRARY_ID = LIBRARY.id;
            const INVALID_AUTHOR_ID = -1;
            try {
                await AuthorActions.remove(VALID_LIBRARY_ID, INVALID_AUTHOR_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Author ${INVALID_AUTHOR_ID}`);
            }
        });

        it("should pass on valid IDs", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withAuthors: true,
                });
            const INPUT = LIBRARY.authors[0];
            const OUTPUT = await AuthorActions.remove(LIBRARY.id, INPUT.id);
            try {
                await AuthorActions.remove(LIBRARY.id, INPUT.id);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Author ${INPUT.id}`);
            }
        });

    });

    describe("AuthorActions.seriesConnect()", () => {

        it("should fail on connecting twice", async () => {
            // Set up LIBRARY, AUTHOR, and SERIES
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const SERIES =
                await SeriesActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Series",
                });
            // Perform the seriesConnect() action once
            try {
                await AuthorActions.seriesConnect(LIBRARY.id, AUTHOR.id, SERIES.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Attempt to perform the action again
            try {
                await AuthorActions.seriesConnect(LIBRARY.id, AUTHOR.id, SERIES.id, true);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`connect: Author ID ${AUTHOR.id} and Series ID ${SERIES.id} are already connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, AUTHOR, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const SERIES =
                await SeriesActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Series",
                });
            // Perform the seriesConnect() action
            try {
                await AuthorActions.seriesConnect(LIBRARY.id, AUTHOR.id, SERIES.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the connection is represented correctly
            const OUTPUT =
                await AuthorActions.find(LIBRARY.id, AUTHOR.id, {
                    withSeries: true,
                });
            expect(OUTPUT.authorsSeries).to.exist;
            const AUTHORS_SERIES = OUTPUT.authorsSeries as AuthorActions.AuthorsSeriesPlus[];
            expect(AUTHORS_SERIES.length).to.equal(1);
            expect(AUTHORS_SERIES[0].authorId).to.equal(AUTHOR.id);
//            expect(AUTHORS_SERIES[0].author).to.exist;
            expect(AUTHORS_SERIES[0].series.id).to.equal(SERIES.id);
            expect(AUTHORS_SERIES[0].series).to.exist;
        });

    });

    describe("AuthorActions.seriesDisconnect()", () => {

        it("should fail on disconnecting twice", async () => {
            // Set up LIBRARY, AUTHOR, and SERIES
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const SERIES =
                await SeriesActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Series",
                });
            // Perform the seriesConnect() action
            try {
                await AuthorActions.seriesConnect(LIBRARY.id, AUTHOR.id, SERIES.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the seriesDisconnect() action
            try {
                await AuthorActions.seriesDisconnect(LIBRARY.id, AUTHOR.id, SERIES.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that disconnecting twice fails
            try {
                await AuthorActions.seriesDisconnect(LIBRARY.id, AUTHOR.id, SERIES.id);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`disconnect: Author ID ${AUTHOR.id} and Series ID ${SERIES.id} are not connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, AUTHOR, and SERIES
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const SERIES =
                await SeriesActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Series",
                });
            // Perform the seriesConnect() action
            try {
                await AuthorActions.seriesConnect(LIBRARY.id, AUTHOR.id, SERIES.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the seriesDisconnect() action
            try {
                await AuthorActions.seriesDisconnect(LIBRARY.id, AUTHOR.id, SERIES.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the disconnect occurred
            const OUTPUT = await AuthorActions.find(LIBRARY.id, AUTHOR.id, {
                withSeries: true,
            });
            expect(OUTPUT.authorsSeries).to.exist;
            expect(OUTPUT.authorsSeries.length).to.equal(0);
        });

    });

    describe("AuthorActions.storyConnect()", () => {

        it("should fail on connecting twice", async () => {
            // Set up LIBRARY, AUTHOR, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the storyConnect() action once
            try {
                await AuthorActions.storyConnect(LIBRARY.id, AUTHOR.id, STORY.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Attempt to perform the action again
            try {
                await AuthorActions.storyConnect(LIBRARY.id, AUTHOR.id, STORY.id, true);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`connect: Author ID ${AUTHOR.id} and Story ID ${STORY.id} are already connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, AUTHOR, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the authorConnect() action
            try {
                await AuthorActions.storyConnect(LIBRARY.id, AUTHOR.id, STORY.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the connection is represented correctly
            const OUTPUT =
                await AuthorActions.find(LIBRARY.id, AUTHOR.id, {
                    withStories: true,
                });
            expect(OUTPUT.authorsStories).to.exist;
            const AUTHORS_STORIES = OUTPUT.authorsStories as AuthorActions.AuthorsStoriesPlus[];
            expect(AUTHORS_STORIES.length).to.equal(1);
            expect(AUTHORS_STORIES[0].authorId).to.equal(AUTHOR.id);
//            expect(AUTHORS_STORIES[0].author).to.exist;
            expect(AUTHORS_STORIES[0].story.id).to.equal(STORY.id);
            expect(AUTHORS_STORIES[0].story).to.exist;
        });

    });

    describe("AuthorActions.storyDisconnect()", () => {

        it("should fail on disconnecting twice", async () => {
            // Set up LIBRARY, AUTHOR, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the authorConnect() action
            try {
                await AuthorActions.storyConnect(LIBRARY.id, AUTHOR.id, STORY.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the authorDisconnect() action
            try {
                await AuthorActions.storyDisconnect(LIBRARY.id, AUTHOR.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that disconnecting twice fails
            try {
                await AuthorActions.storyDisconnect(LIBRARY.id, AUTHOR.id, STORY.id);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`disconnect: Author ID ${AUTHOR.id} and Story ID ${STORY.id} are not connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, AUTHOR, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the storyConnect() action
            try {
                await AuthorActions.storyConnect(LIBRARY.id, AUTHOR.id, STORY.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the storyDisconnect() action
            try {
                await AuthorActions.storyDisconnect(LIBRARY.id, AUTHOR.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the disconnect occurred
            const OUTPUT = await AuthorActions.find(LIBRARY.id, AUTHOR.id, {
                withStories: true,
            });
            expect(OUTPUT.authorsStories).to.exist;
            expect(OUTPUT.authorsStories.length).to.equal(0);
        });

    });

    describe("AuthorActions.update()", () => {

        it("should fail on duplicate name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withAuthors: true,
                });
            const ORIGINAL =
                await AuthorActions.find(LIBRARY.id, LIBRARY.authors[0].id);
            const INPUT: Prisma.AuthorUncheckedUpdateInput = {
                firstName: LIBRARY.authors[1].firstName,
                lastName: LIBRARY.authors[1].lastName,
            }
            try {
                await AuthorActions.update(LIBRARY.id, ORIGINAL.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                expect((error as Error).message).to.include
                (`name: Author name '${INPUT.firstName} ${INPUT.lastName}' is already in use`);
            }
        });

        it("should pass on no change update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withAuthors: true,
                });
            const INPUT = LIBRARY.authors[0];
            const UPDATE: Prisma.AuthorUncheckedUpdateInput = {
                active: INPUT.active,
                firstName: INPUT.firstName,
                lastName: INPUT.lastName,
                notes: INPUT.notes,
            }
            try {
                const OUTPUT =
                    await AuthorActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareAuthorOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

        it("should pass on no data update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withAuthors: true,
                });
            const INPUT = LIBRARY.authors[0];
            const UPDATE: Prisma.AuthorUncheckedUpdateInput = {};
            try {
                const OUTPUT =
                    await AuthorActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareAuthorOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

        it("should pass on valid change update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withAuthors: true,
                });
            const INPUT = LIBRARY.authors[0];
            const UPDATE: Prisma.AuthorUncheckedUpdateInput = {
                active: INPUT.active ? !INPUT.active : undefined,
                firstName: INPUT.firstName + " NEW",
                lastName: INPUT.lastName + " NEW",
                notes: INPUT.notes ? (INPUT.notes + " NEW") : undefined,
            }
            try {
                const OUTPUT =
                    await AuthorActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareAuthorOld(OUTPUT, UPDATE as Author);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

    });

/*
    describe("AuthorActions.volumeConnect()", () => {

        it("should fail on connecting twice", async () => {
            // Set up LIBRARY, AUTHOR, and VOLUME
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const VOLUME =
                await VolumeActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the storyConnect() action once
            try {
                await AuthorActions.volumeConnect(LIBRARY.id, AUTHOR.id, VOLUME.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Attempt to perform the action again
            try {
                await AuthorActions.volumeConnect(LIBRARY.id, AUTHOR.id, VOLUME.id, true);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`connect: Author ID ${AUTHOR.id} and Volume ID ${VOLUME.id} are already connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, AUTHOR, and VOLUME
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const VOLUME =
                await VolumeActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the volumeConnect() action
            try {
                await AuthorActions.volumeConnect(LIBRARY.id, AUTHOR.id, VOLUME.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the connection is represented correctly
            const OUTPUT =
                await AuthorActions.find(LIBRARY.id, AUTHOR.id, {
                    withVolumes: true,
                });
            expect(OUTPUT.authorsVolumes).to.exist;
            const AUTHORS_VOLUMES = OUTPUT.authorsVolumes as AuthorActions.AuthorsVolumesPlus[];
            expect(AUTHORS_VOLUMES.length).to.equal(1);
            expect(AUTHORS_VOLUMES[0].authorId).to.equal(AUTHOR.id);
            expect(AUTHORS_VOLUMES[0].author).to.exist;
            expect(AUTHORS_VOLUMES[0].volume.id).to.equal(VOLUME.id);
            expect(AUTHORS_VOLUMES[0].volume).to.exist;
        });

    });
*/

/*
    describe("AuthorActions.volumeDisconnect()", () => {

        it("should fail on disconnecting twice", async () => {
            // Set up LIBRARY, AUTHOR, and VOLUME
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const VOLUME =
                await VolumeActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the volumeConnect() action
            try {
                await AuthorActions.volumeConnect(LIBRARY.id, AUTHOR.id, VOLUME.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the volumeDisconnect() action
            try {
                await AuthorActions.volumeDisconnect(LIBRARY.id, AUTHOR.id, VOLUME.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that disconnecting twice fails
            try {
                await AuthorActions.volumeDisconnect(LIBRARY.id, AUTHOR.id, VOLUME.id);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`disconnect: Author ID ${AUTHOR.id} and Volume ID ${VOLUME.id} are not connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, AUTHOR, and VOLUME
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const AUTHOR =
                await AuthorActions.insert(LIBRARY.id, {
                    firstName: "Test First",
                    lastName: "Test Last",
                    libraryId: LIBRARY.id,
                });
            const VOLUME =
                await VolumeActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the volumeConnect() action
            try {
                await AuthorActions.volumeConnect(LIBRARY.id, AUTHOR.id, VOLUME.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the volumeDisconnect() action
            try {
                await AuthorActions.volumeDisconnect(LIBRARY.id, AUTHOR.id, VOLUME.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the disconnect occurred
            const OUTPUT = await AuthorActions.find(LIBRARY.id, AUTHOR.id, {
                withVolumes: true,
            });
            expect(OUTPUT.authorsVolumes).to.exist;
            expect(OUTPUT.authorsVolumes.length).to.equal(0);
        });

    });
*/

});

// Private Objects -----------------------------------------------------------

export function compareAuthorNew(OUTPUT: Author, INPUT: Author, libraryId: number) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.firstName).to.equal(INPUT.firstName ? INPUT.firstName : null);
    expect(OUTPUT.lastName).to.equal(INPUT.lastName ? INPUT.lastName : null);
    expect(OUTPUT.libraryId).to.equal(libraryId);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
}

export function compareAuthorOld(OUTPUT: Author, INPUT: Author) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.firstName).to.equal(INPUT.firstName ? INPUT.firstName : OUTPUT.firstName);
    expect(OUTPUT.lastName).to.equal(INPUT.lastName ? INPUT.lastName : OUTPUT.lastName);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId ? INPUT.libraryId : OUTPUT.libraryId);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
}

