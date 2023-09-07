// actions/SeriesActions.test.ts

/**
 * Functional tests for SeriesActions
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
import {
    Prisma,
    Series,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "./AuthorActions";
import * as LibraryActions from "./LibraryActions";
import * as SeriesActions from "./SeriesActions";
import * as StoryActions from "./StoryActions";
import ActionsUtils from "@/test/ActionsUtils";
import * as SeedData from "@/test/SeedData";
import {AuthorsSeriesPlus} from "@/types/models/Author";
import {SeriesStoriesPlus} from "@/types/models/Series";
import {NotFound, NotUnique} from "@/util/HttpErrors";

const UTILS = new ActionsUtils();

// Test Specifications -------------------------------------------------------

describe("SeriesActions Functional Tests", () => {

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

    describe("SeriesActions.all()", () => {

        it("should pass on active Series", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS =
                await SeriesActions.all(LIBRARY.id, { active: true });
            for (const INPUT of INPUTS) {
                expect(INPUT.active).to.be.true;
            }
        });

        it("should pass on all Series", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS =
                await SeriesActions.all(LIBRARY.id);
            expect(INPUTS.length).to.equal(SeedData.SERIES_LIBRARY1.length);
        });

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS =
                await SeriesActions.all(LIBRARY.id, {
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
            const INPUTS = await SeriesActions.all(LIBRARY.id, {
                withAuthors: true,
                withStories: true,
            });
            for (const INPUT of INPUTS) {
                try {
                    expect(INPUT.authorsSeries).to.exist;
                    expect(INPUT.seriesStories).to.exist;
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on named Series", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const PATTERN = "tT";
            const OUTPUTS =
                await SeriesActions.all(LIBRARY.id, { name: PATTERN });
            expect(OUTPUTS.length).to.be.greaterThan(0);
            for (const OUTPUT of OUTPUTS) {
                expect(OUTPUT.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            }
        });

        it("should pass on paginated Series", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await SeriesActions.all(LIBRARY.id);
            const OUTPUTS = await SeriesActions.all(LIBRARY.id, {
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(SeedData.SERIES_LIBRARY0.length - 1);
            OUTPUTS.forEach((OUTPUT, index) =>  {
                compareSeriesOld(OUTPUT, INPUTS[index + OFFSET]);
            });
        });

    });

    describe("SeriesActions.authorConnect()", () => {

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
            // Perform the authorConnect() action once
            try {
                await SeriesActions.authorConnect(LIBRARY.id, SERIES.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Attempt to perform the action again
            try {
                await SeriesActions.authorConnect(LIBRARY.id, SERIES.id, AUTHOR.id, true);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`connect: Series ID ${SERIES.id} and Author ID ${AUTHOR.id} are already connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}`);
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
            // Perform the authorConnect() action
            try {
                await SeriesActions.authorConnect(LIBRARY.id, SERIES.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the connection is represented correctly
            const OUTPUT =
                await SeriesActions.find(LIBRARY.id, SERIES.id, {
                    withAuthors: true,
                });
            expect(OUTPUT.authorsSeries).to.exist;
            const AUTHORS_STORIES = OUTPUT.authorsSeries as AuthorsSeriesPlus[];
            expect(AUTHORS_STORIES.length).to.equal(1);
            expect(AUTHORS_STORIES[0].authorId).to.equal(AUTHOR.id);
            expect(AUTHORS_STORIES[0].author).to.exist;
            expect(AUTHORS_STORIES[0].seriesId).to.equal(SERIES.id);
//            expect(AUTHORS_STORIES[0].series).to.exist;
        });

    });

    describe("SeriesActions.authorDisconnect()", () => {

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
            // Perform the authorConnect() action
            try {
                await SeriesActions.authorConnect(LIBRARY.id, SERIES.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the authorDisconnect() action
            try {
                await SeriesActions.authorDisconnect(LIBRARY.id, SERIES.id, AUTHOR.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that disconnecting twice fails
            try {
                await SeriesActions.authorDisconnect(LIBRARY.id, SERIES.id, AUTHOR.id);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`disconnect: Series ID ${SERIES.id} and Author ID ${AUTHOR.id} are not connected`);
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
            // Perform the authorConnect() action
            try {
                await SeriesActions.authorConnect(LIBRARY.id, SERIES.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the authorDisconnect() action
            try {
                await SeriesActions.authorDisconnect(LIBRARY.id, SERIES.id, AUTHOR.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the disconnect occurred
            const OUTPUT = await SeriesActions.find(LIBRARY.id, SERIES.id, {
                withAuthors: true,
            });
            expect(OUTPUT.authorsSeries).to.exist;
            expect(OUTPUT.authorsSeries.length).to.equal(0);
        });

    });

    describe("SeriesActions.authors()", () => {

        it("should fail on invalid seriesId", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const SERIES_ID = 9999;
            try {
                await SeriesActions.authors(LIBRARY.id, SERIES_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Series ${SERIES_ID}`);
            }
        });

        it("should pass on valid seriesId", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const SERIES =
                await SeriesActions.exact(LIBRARY.id, SeedData.SERIES_LIBRARY1[0].name);
            try {
                const authors = await SeriesActions.authors(LIBRARY.id, SERIES.id);
                expect(authors.length).to.be.greaterThan(0);
                for (const author of authors) {
                    expect(author.libraryId).to.equal(LIBRARY.id);
                }
            } catch (error) {
                expect.fail(`Should not have thrown ${(error as Error).message}`);
            }
        })

    });

    describe("SeriesActions.exact()", () => {

        it("should fail on invalid name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INVALID_NAME = "INVALID SERIES NAME";
            try {
                await SeriesActions.exact(LIBRARY.id, INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing Series '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await SeriesActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await SeriesActions.exact(LIBRARY.id, INPUT.name, {
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
            const INPUTS = await SeriesActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await SeriesActions.exact(LIBRARY.id, INPUT.name, {
                            withAuthors: true,
                            withStories: true,
                        });
                    expect(OUTPUT.authorsSeries).to.exist;
                    expect(OUTPUT.seriesStories).to.exist;
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid names", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await SeriesActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await SeriesActions.exact(LIBRARY.id, INPUT.name);
                    expect(OUTPUT.name).to.equal(INPUT.name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("SeriesActions.find()", () => {

        it("should fail on invalid ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INVALID_ID = 9999;
            try {
                await SeriesActions.find(LIBRARY.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`id: Missing Series ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await SeriesActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await SeriesActions.find(LIBRARY.id, INPUT.id, {
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
            const INPUTS = await SeriesActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await SeriesActions.find(LIBRARY.id, INPUT.id, {
                            withAuthors: true,
                            withStories: true,
                        });
                    //console.log("STORY", OUTPUT);
                    expect(OUTPUT.authorsSeries).to.exist;
                    expect(OUTPUT.seriesStories).to.exist;
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid ids", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS =
                await SeriesActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await SeriesActions.find(LIBRARY.id, INPUT.id);
                    compareSeriesOld(OUTPUT, INPUT);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("SeriesActions.insert()", () => {

        it("should fail on duplicate name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withSeries: true,
                });
            const INPUT: Prisma.SeriesUncheckedCreateInput = {
                libraryId: -1,          // Will get replaced
                name: LIBRARY.series[0].name,
            }
            try {
                await SeriesActions.insert(LIBRARY.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`name: Series name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid input data", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withSeries: true,
                });
            const INPUT: Prisma.SeriesUncheckedCreateInput = {
                active: false,
                copyright: "2023",
                libraryId: -1,          // Will get replaced
                name: LIBRARY.series[0].name + " NEW",
                notes: "Valid notes",
            }
            try {
                const OUTPUT =
                    await SeriesActions.insert(LIBRARY.id, INPUT);
                compareSeriesNew(OUTPUT, INPUT as Series, LIBRARY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

    });

    describe("SeriesActions.remove()", () => {

        it("should fail on invalid library ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withSeries: true,
                });
            const INVALID_LIBRARY_ID = -1;
            const VALID_STORY_ID = LIBRARY.series[0].id;
            try {
                await SeriesActions.remove(INVALID_LIBRARY_ID, VALID_STORY_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Series ${VALID_STORY_ID}`);
            }
        });

        it("should fail on invalid story ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withSeries: true,
                });
            const VALID_LIBRARY_ID = LIBRARY.id;
            const INVALID_STORY_ID = -1;
            try {
                await SeriesActions.remove(VALID_LIBRARY_ID, INVALID_STORY_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Series ${INVALID_STORY_ID}`);
            }
        });

        it("should pass on valid IDs", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withSeries: true,
                });
            const INPUT = LIBRARY.series[0];
            const OUTPUT = await SeriesActions.remove(LIBRARY.id, INPUT.id);
            try {
                await SeriesActions.remove(LIBRARY.id, INPUT.id);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Series ${INPUT.id}`);
            }
        });

    });

    describe("SeriesActions.storyConnect()", () => {

        it("should fail on connecting twice", async () => {
            // Set up LIBRARY, SERIES, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const SERIES =
                await SeriesActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Series",
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the storyConnect() action once
            try {
                await SeriesActions.storyConnect(LIBRARY.id, SERIES.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Attempt to perform the action again
            try {
                await SeriesActions.storyConnect(LIBRARY.id, SERIES.id, STORY.id);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`connect: Series ID ${SERIES.id} and Story ID ${STORY.id} are already connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, SERIES, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const SERIES =
                await SeriesActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Series",
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the storyConnect() action
            try {
                await SeriesActions.storyConnect(LIBRARY.id, SERIES.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the connection is represented correctly
            const OUTPUT =
                await SeriesActions.find(LIBRARY.id, SERIES.id, {
                    withStories: true,
                });
            expect(OUTPUT.seriesStories).to.exist;
            const SERIES_STORIES = OUTPUT.seriesStories as SeriesStoriesPlus[];
            expect(SERIES_STORIES.length).to.equal(1);
            expect(SERIES_STORIES[0].seriesId).to.equal(SERIES.id);
//            expect(SERIES_STORIES[0].series).to.exist;
            expect(SERIES_STORIES[0].story.id).to.equal(STORY.id);
            expect(SERIES_STORIES[0].story).to.exist;
        });

    });

    describe("SeriesActions.storyDisconnect()", () => {

        it("should fail on disconnecting twice", async () => {
            // Set up LIBRARY, SERIES, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const SERIES =
                await SeriesActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Series",
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the authorConnect() action
            try {
                await SeriesActions.storyConnect(LIBRARY.id, SERIES.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the storyDisconnect() action
            try {
                await SeriesActions.storyDisconnect(LIBRARY.id, SERIES.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that disconnecting twice fails
            try {
                await SeriesActions.storyDisconnect(LIBRARY.id, SERIES.id, STORY.id);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`disconnect: Series ID ${SERIES.id} and Story ID ${STORY.id} are not connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, SERIES, and STORY
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const SERIES =
                await SeriesActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Series",
                });
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            // Perform the storyConnect() action
            try {
                await SeriesActions.storyConnect(LIBRARY.id, SERIES.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the storyDisconnect() action
            try {
                await SeriesActions.storyDisconnect(LIBRARY.id, SERIES.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the disconnect occurred
            const OUTPUT = await SeriesActions.find(LIBRARY.id, SERIES.id, {
                withStories: true,
            });
            expect(OUTPUT.seriesStories).to.exist;
            expect(OUTPUT.seriesStories.length).to.equal(0);
        });

    });

    describe("SeriesActions.stories()", () => {

        it("should fail on invalid seriesId", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const SERIES_ID = 9999;
            try {
                await SeriesActions.stories(LIBRARY.id, SERIES_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Series ${SERIES_ID}`);
            }
        });

        it("should pass on valid seriesId", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const SERIES =
                await SeriesActions.exact(LIBRARY.id, SeedData.SERIES_LIBRARY0[0].name);
            try {
                const stories = await SeriesActions.stories(LIBRARY.id, SERIES.id);
                expect(stories.length).to.be.greaterThan(0);
                for (const story of stories) {
                    expect(story.libraryId).to.equal(LIBRARY.id);
                }
            } catch (error) {
                expect.fail(`Should not have thrown ${(error as Error).message}`);
            }
        });

    });

        describe("SeriesActions.update()", () => {

        it("should fail on duplicate name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withSeries: true,
                });
            const ORIGINAL =
                await SeriesActions.find(LIBRARY.id, LIBRARY.series[0].id);
            const INPUT: Prisma.SeriesUncheckedUpdateInput = {
                name: LIBRARY.series[1].name,
            }
            try {
                await SeriesActions.update(LIBRARY.id, ORIGINAL.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                expect((error as Error).message).to.include
                (`name: Series name '${INPUT.name}' is already in use`);
            }
        });

        it("should pass on no change update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withSeries: true,
                });
            const INPUT = LIBRARY.series[0];
            const UPDATE: Prisma.SeriesUncheckedUpdateInput = {
                active: INPUT.active,
                copyright: INPUT.copyright,
                name: INPUT.name,
                notes: INPUT.notes,
            }
            try {
                const OUTPUT =
                    await SeriesActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareSeriesOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

        it("should pass on no data update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withSeries: true,
                });
            const INPUT = LIBRARY.series[0];
            const UPDATE: Prisma.SeriesUncheckedUpdateInput = {};
            try {
                const OUTPUT =
                    await SeriesActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareSeriesOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

        it("should pass on valid change update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withSeries: true,
                });
            const INPUT = LIBRARY.series[0];
            const UPDATE: Prisma.SeriesUncheckedUpdateInput = {
                active: INPUT.active ? !INPUT.active : undefined,
                copyright: INPUT.copyright ? (INPUT.copyright + " NEW") : undefined,
                name: INPUT.name + " NEW",
                notes: INPUT.notes ? (INPUT.notes + " NEW") : undefined,
            }
            try {
                const OUTPUT =
                    await SeriesActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareSeriesOld(OUTPUT, UPDATE as Series);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

    });

});

// Private Objects -----------------------------------------------------------

export function compareSeriesNew(OUTPUT: Series, INPUT: Series, libraryId: number) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : null);
    expect(OUTPUT.libraryId).to.equal(libraryId);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
}

export function compareSeriesOld(OUTPUT: Series, INPUT: Series) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : OUTPUT.copyright);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId ? INPUT.libraryId : OUTPUT.libraryId);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
}

