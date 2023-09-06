// actions/VolumeActions.test.ts

/**
 * Functional tests for VolumeActions
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
import {
    Prisma,
    Volume,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as AuthorActions from "./AuthorActions";
import * as LibraryActions from "./LibraryActions";
import * as StoryActions from "./StoryActions";
import * as VolumeActions from "./VolumeActions";
import ActionsUtils from "@/test/ActionsUtils";
import * as SeedData from "@/test/SeedData";
import {AuthorsVolumesPlus} from "@/types/models/Author";
import {VolumesStoriesPlus} from "@/types/models/Volume";
import {NotFound, NotUnique} from "@/util/HttpErrors";

const UTILS = new ActionsUtils();

// Test Specifications -------------------------------------------------------

describe("VolumeActions Functional Tests", () => {

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

    describe("VolumeActions.all()", () => {

        it("should pass on active Volumes", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS =
                await VolumeActions.all(LIBRARY.id, { active: true });
            for (const INPUT of INPUTS) {
                expect(INPUT.active).to.be.true;
            }
        });

        it("should pass on all Volumes", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS =
                await VolumeActions.all(LIBRARY.id);
            expect(INPUTS.length).to.equal(SeedData.VOLUMES_LIBRARY1.length);
        });

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS =
                await VolumeActions.all(LIBRARY.id, {
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
            const INPUTS = await VolumeActions.all(LIBRARY.id, {
                withAuthors: true,
                withStories: true,
            });
            for (const INPUT of INPUTS) {
                try {
                    expect(INPUT.authorsVolumes).to.exist;
                    expect(INPUT.volumesStories).to.exist;
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on named Volumes", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const PATTERN = "tT";
            const OUTPUTS =
                await VolumeActions.all(LIBRARY.id, { name: PATTERN });
            expect(OUTPUTS.length).to.be.greaterThan(0);
            for (const OUTPUT of OUTPUTS) {
                expect(OUTPUT.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            }
        });

        it("should pass on paginated Volumes", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await VolumeActions.all(LIBRARY.id);
            const OUTPUTS = await VolumeActions.all(LIBRARY.id, {
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(SeedData.VOLUMES_LIBRARY0.length - 1);
            OUTPUTS.forEach((OUTPUT, index) =>  {
                compareVolumeOld(OUTPUT, INPUTS[index + OFFSET]);
            });
        });

    });

    describe("VolumeActions.authorConnect()", () => {

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
                    location: "Other",
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the authorConnect() action once
            try {
                await VolumeActions.authorConnect(LIBRARY.id, VOLUME.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Attempt to perform the action again
            try {
                await VolumeActions.authorConnect(LIBRARY.id, VOLUME.id, AUTHOR.id, true);
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
                    location: "Other",
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the authorConnect() action
            try {
                await VolumeActions.authorConnect(LIBRARY.id, VOLUME.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the connection is represented correctly
            const OUTPUT =
                await VolumeActions.find(LIBRARY.id, VOLUME.id, {
                    withAuthors: true,
                });
            expect(OUTPUT.authorsVolumes).to.exist;
            const AUTHORS_VOLUMES = OUTPUT.authorsVolumes as AuthorsVolumesPlus[];
            expect(AUTHORS_VOLUMES.length).to.equal(1);
            expect(AUTHORS_VOLUMES[0].authorId).to.equal(AUTHOR.id);
            expect(AUTHORS_VOLUMES[0].author).to.exist;
            expect(AUTHORS_VOLUMES[0].volumeId).to.equal(VOLUME.id);
//            expect(AUTHORS_VOLUMES[0].volume).to.exist;
        });

    });

    describe("VolumeActions.authorDisconnect()", () => {

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
                    location: "Other",
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the authorConnect() action
            try {
                await VolumeActions.authorConnect(LIBRARY.id, VOLUME.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the authorDisconnect() action
            try {
                await VolumeActions.authorDisconnect(LIBRARY.id, VOLUME.id, AUTHOR.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that disconnecting twice fails
            try {
                await VolumeActions.authorDisconnect(LIBRARY.id, VOLUME.id, AUTHOR.id);
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
                    location: "Other",
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the authorConnect() action
            try {
                await VolumeActions.authorConnect(LIBRARY.id, VOLUME.id, AUTHOR.id, true);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the authorDisconnect() action
            try {
                await VolumeActions.authorDisconnect(LIBRARY.id, VOLUME.id, AUTHOR.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the disconnect occurred
            const OUTPUT = await VolumeActions.find(LIBRARY.id, VOLUME.id, {
                withAuthors: true,
            });
            expect(OUTPUT.authorsVolumes).to.exist;
            expect(OUTPUT.authorsVolumes.length).to.equal(0);
        });

    });

    describe("VolumeActions.exact()", () => {

        it("should fail on invalid name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INVALID_NAME = "INVALID VOLUME NAME";
            try {
                await VolumeActions.exact(LIBRARY.id, INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing Volume '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await VolumeActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await VolumeActions.exact(LIBRARY.id, INPUT.name, {
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
            const INPUTS = await VolumeActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await VolumeActions.exact(LIBRARY.id, INPUT.name, {
                            withAuthors: true,
                            withStories: true,
                        });
                    //console.log("VOLUME", OUTPUT);
                    expect(OUTPUT.authorsVolumes).to.exist;
                    expect(OUTPUT.volumesStories).to.exist;
                    if (OUTPUT.name !== "Rubble Volume") { // Quirk of seed data
                        expect(OUTPUT.authorsVolumes.length).to.be.greaterThan(0);
                        expect(OUTPUT.volumesStories.length).to.be.greaterThan(0);
                    }
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid names", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await VolumeActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await VolumeActions.exact(LIBRARY.id, INPUT.name);
                    expect(OUTPUT.name).to.equal(INPUT.name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("VolumeActions.find()", () => {

        it("should fail on invalid ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INVALID_ID = 9999;
            try {
                await VolumeActions.find(LIBRARY.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`id: Missing Volume ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it("should pass on included parent", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const INPUTS = await VolumeActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await VolumeActions.find(LIBRARY.id, INPUT.id, {
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
            const INPUTS = await VolumeActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await VolumeActions.find(LIBRARY.id, INPUT.id, {
                            withAuthors: true,
                            withStories: true,
                        });
                    //console.log("VOLUME", OUTPUT);
                    expect(OUTPUT.authorsVolumes).to.exist;
                    expect(OUTPUT.volumesStories).to.exist;
                    if (OUTPUT.name !== "Rubble Volume") { // Quirk of seed data
                        expect(OUTPUT.authorsVolumes.length).to.be.greaterThan(0);
                        expect(OUTPUT.volumesStories.length).to.be.greaterThan(0);
                    }
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid ids", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND);
            const INPUTS =
                await VolumeActions.all(LIBRARY.id);
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await VolumeActions.find(LIBRARY.id, INPUT.id);
                    compareVolumeOld(OUTPUT, INPUT);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("VolumeActions.insert()", () => {

        it("should fail on duplicate name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withVolumes: true,
                });
            const INPUT: Prisma.VolumeUncheckedCreateInput = {
                libraryId: -1,          // Will get replaced
                location: "Other",
                name: LIBRARY.volumes[0].name,
                type: "Single",
            }
            try {
                await VolumeActions.insert(LIBRARY.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`name: Volume name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid input data", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withVolumes: true,
                });
            const INPUT: Prisma.VolumeUncheckedCreateInput = {
                active: false,
                libraryId: -1,          // Will get replaced
                location: "Other",
                name: LIBRARY.volumes[0].name + " NEW",
                notes: "Valid notes",
                type: "Single",
            }
            try {
                const OUTPUT =
                    await VolumeActions.insert(LIBRARY.id, INPUT);
                compareVolumeNew(OUTPUT, INPUT as Volume, LIBRARY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

    });

    describe("VolumeActions.remove()", () => {

        it("should fail on invalid library ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withVolumes: true,
                });
            const INVALID_LIBRARY_ID = -1;
            const VALID_VOLUME_ID = LIBRARY.volumes[0].id;
            try {
                await VolumeActions.remove(INVALID_LIBRARY_ID, VALID_VOLUME_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Volume ${VALID_VOLUME_ID}`);
            }
        });

        it("should fail on invalid volume ID", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withVolumes: true,
                });
            const VALID_LIBRARY_ID = LIBRARY.id;
            const INVALID_VOLUME_ID = -1;
            try {
                await VolumeActions.remove(VALID_LIBRARY_ID, INVALID_VOLUME_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Volume ${INVALID_VOLUME_ID}`);
            }
        });

        it("should pass on valid IDs", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withVolumes: true,
                });
            const INPUT = LIBRARY.volumes[0];
            const OUTPUT = await VolumeActions.remove(LIBRARY.id, INPUT.id);
            try {
                await VolumeActions.remove(LIBRARY.id, INPUT.id);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                expect((error as Error).message).to.include
                (`id: Missing Volume ${INPUT.id}`);
            }
        });

    });

    describe("VolumeActions.storyConnect()", () => {

        it("should fail on connecting twice", async () => {
            // Set up LIBRARY, STORY, and VOLUME
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            const VOLUME =
                await VolumeActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    location: "Other",
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the storyConnect() action once
            try {
                await VolumeActions.storyConnect(LIBRARY.id, VOLUME.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Attempt to perform the action again
            try {
                await VolumeActions.storyConnect(LIBRARY.id, VOLUME.id, STORY.id);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                if (error instanceof NotUnique) {
                    expect(error.message).to.include
                    (`connect: Story ID ${STORY.id} and Volume ID ${VOLUME.id} are already connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, STORY, and VOLUME
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Story Name",
                });
            const VOLUME =
                await VolumeActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    location: "Other",
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the storyConnect() action
            try {
                await VolumeActions.storyConnect(LIBRARY.id, VOLUME.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the connection is represented correctly
            const OUTPUT =
                await VolumeActions.find(LIBRARY.id, VOLUME.id, {
                    withStories: true,
                });
            expect(OUTPUT.volumesStories).to.exist;
            const VOLUMES_STORIES = OUTPUT.volumesStories as VolumesStoriesPlus[];
            expect(VOLUMES_STORIES.length).to.equal(1);
            expect(VOLUMES_STORIES[0].storyId).to.equal(STORY.id);
            expect(VOLUMES_STORIES[0].story).to.exist;
            expect(VOLUMES_STORIES[0].volumeId).to.equal(VOLUME.id);
//            expect(VOLUMES_STORIES[0].volume).to.exist;
        });

    });

    describe("VolumeActions.storyDisconnect()", () => {

        it("should fail on disconnecting twice", async () => {
            // Set up LIBRARY, STORY, and VOLUME
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Test Story",
                });
            const VOLUME =
                await VolumeActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    location: "Other",
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the storyConnect() action
            try {
                await VolumeActions.storyConnect(LIBRARY.id, VOLUME.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the storyDisconnect() action
            try {
                await VolumeActions.storyDisconnect(LIBRARY.id, VOLUME.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that disconnecting twice fails
            try {
                await VolumeActions.storyDisconnect(LIBRARY.id, VOLUME.id, STORY.id);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`disconnect: Story ID ${STORY.id} and Volume ID ${VOLUME.id} are not connected`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid data", async () => {
            // Set up LIBRARY, STORY, and VOLUME
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const STORY =
                await StoryActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    name: "Story Name",
                });
            const VOLUME =
                await VolumeActions.insert(LIBRARY.id, {
                    libraryId: LIBRARY.id,
                    location: "Other",
                    name: "Test Volume",
                    type: "Single",
                });
            // Perform the storyConnect() action
            try {
                await VolumeActions.storyConnect(LIBRARY.id, VOLUME.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Perform the storyDisconnect() action
            try {
                await VolumeActions.storyDisconnect(LIBRARY.id, VOLUME.id, STORY.id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
            // Verify that the disconnect occurred
            const OUTPUT = await VolumeActions.find(LIBRARY.id, VOLUME.id, {
                withStories: true,
            });
            expect(OUTPUT.volumesStories).to.exist;
            expect(OUTPUT.volumesStories.length).to.equal(0);
        });

    });

    describe("VolumeActions.stories()", () => {

        it("should fail on invalid volumeId", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_THIRD);
            const VOLUME_ID = 9999;
            try {
                await VolumeActions.stories(LIBRARY.id, VOLUME_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                expect((error as Error).message).to.include
                    (`id: Missing Volume ${VOLUME_ID}`);
            }
        });

        it("should pass on valid volumeId", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST);
            const VOLUME =
                await VolumeActions.exact(LIBRARY.id, SeedData.VOLUMES_LIBRARY0[0].name);
            try {
                const stories = await VolumeActions.stories(LIBRARY.id, VOLUME.id);
                expect(stories.length).to.be.greaterThan(0);
                for (const story of stories) {
                    expect(story.libraryId).to.equal(LIBRARY.id);
                }
            } catch (error) {
                expect.fail(`Should not have thrown ${(error as Error).message}`);
            }
        })

    });

    describe("VolumeActions.update()", () => {

        it("should fail on duplicate name", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withVolumes: true,
                });
            const ORIGINAL =
                await VolumeActions.find(LIBRARY.id, LIBRARY.volumes[0].id);
            const INPUT: Prisma.VolumeUncheckedUpdateInput = {
                name: LIBRARY.volumes[1].name,
            }
            try {
                await VolumeActions.update(LIBRARY.id, ORIGINAL.id, INPUT);
                expect.fail("Should have thrown NotUnique");
            } catch (error) {
                expect((error as Error).message).to.include
                (`name: Volume name '${INPUT.name}' is already in use`);
            }
        });

        it("should pass on no change update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withVolumes: true,
                });
            const INPUT = LIBRARY.volumes[0];
            const UPDATE: Prisma.VolumeUncheckedUpdateInput = {
                active: INPUT.active,
                copyright: INPUT.copyright,
                googleId: INPUT.googleId,
                isbn: INPUT.isbn,
                location: INPUT.location,
                name: INPUT.name,
                notes: INPUT.notes,
                read: INPUT.read,
                type: INPUT.type,
            }
            try {
                const OUTPUT =
                    await VolumeActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareVolumeOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

        it("should pass on no data update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_FIRST, {
                    withVolumes: true,
                });
            const INPUT = LIBRARY.volumes[0];
            const UPDATE: Prisma.VolumeUncheckedUpdateInput = {};
            try {
                const OUTPUT =
                    await VolumeActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareVolumeOld(OUTPUT, INPUT);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

        it("should pass on valid change update", async () => {
            const LIBRARY =
                await LibraryActions.exact(SeedData.LIBRARY_NAME_SECOND, {
                    withVolumes: true,
                });
            const INPUT = LIBRARY.volumes[0];
            const UPDATE: Prisma.VolumeUncheckedUpdateInput = {
                active: INPUT.active ? !INPUT.active : undefined,
                copyright: INPUT.copyright ? (INPUT.copyright + " NEW") : undefined,
                name: INPUT.name + " NEW",
                notes: INPUT.notes ? (INPUT.notes + " NEW") : undefined,
            }
            try {
                const OUTPUT =
                    await VolumeActions.update(LIBRARY.id, INPUT.id, UPDATE);
                compareVolumeOld(OUTPUT, UPDATE as Volume);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        });

    });

});

// Private Objects -----------------------------------------------------------

export function compareVolumeNew(OUTPUT: Volume, INPUT: Volume, libraryId: number) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : null);
    expect(OUTPUT.googleId).to.equal(INPUT.googleId ? INPUT.googleId : null);
    expect(OUTPUT.isbn).to.equal(INPUT.isbn ? INPUT.isbn : null);
    expect(OUTPUT.libraryId).to.equal(libraryId);
    expect(OUTPUT.location).to.equal(INPUT.location ? INPUT.location : null);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.read).to.equal(INPUT.read !== undefined ? INPUT.read : false);
    expect(OUTPUT.type).to.equal(INPUT.type ? INPUT.type : null);
}

export function compareVolumeOld(OUTPUT: Volume, INPUT: Volume) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.copyright).to.equal(INPUT.copyright ? INPUT.copyright : OUTPUT.copyright);
    expect(OUTPUT.googleId).to.equal(INPUT.googleId ? INPUT.googleId : OUTPUT.googleId);
    expect(OUTPUT.isbn).to.equal(INPUT.isbn ? INPUT.isbn : OUTPUT.isbn);
    expect(OUTPUT.libraryId).to.equal(INPUT.libraryId ? INPUT.libraryId : OUTPUT.libraryId);
    expect(OUTPUT.location).to.equal(INPUT.location ? INPUT.location : OUTPUT.location);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.read).to.equal(INPUT.read !== undefined ? INPUT.read : OUTPUT.read);
    expect(OUTPUT.type).to.equal(INPUT.type ? INPUT.type : OUTPUT.type);
}

