// util/ApplicationValidators.test.ts

/**
 * Unit tests for functions in ApplicationValidators.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import {
    validateHref,
} from "./ApplicationValidators";

// Test Specifications -------------------------------------------------------

describe("ApplicationValidators Unit Tests", () => {

    describe("ApplicationValidators.validateHref", () => {

        it("should fail on invalid hrefs", () => {
            expect(validateHref("http://www.example.com/valumes/123")).to.be.false;
            expect(validateHref("/base/123/authors/-456")).to.be.false;
            expect(validateHref("/base/123/series/-456")).to.be.false;
            expect(validateHref("/base/123/stories/-456")).to.be.false;
            expect(validateHref("/base/123/volumes/-456")).to.be.false;
            expect(validateHref("/base/1b3/authors/456")).to.be.false;
            expect(validateHref("/base/1b3/series/456")).to.be.false;
            expect(validateHref("/base/1b3/stories/456")).to.be.false;
            expect(validateHref("/base/1b3/volumes/456")).to.be.false;
            expect(validateHref("foo/authors/123/456")).to.be.false;
            expect(validateHref("foo/series/123/456")).to.be.false;
            expect(validateHref("foo/stories/123/456")).to.be.false;
            expect(validateHref("foo/volumes/123/456")).to.be.false;
            expect(validateHref("/foo/authors/123/456")).to.be.false;
            expect(validateHref("/foo/series/123/456")).to.be.false;
            expect(validateHref("/foo/stories/123/456")).to.be.false;
            expect(validateHref("/foo/volumes/123/456")).to.be.false;
            expect(validateHref("/authors/123")).to.be.false;
            expect(validateHref("/authors/-123/456")).to.be.false;
            expect(validateHref("/authors/1b3/456")).to.be.false;
            expect(validateHref("/series/123")).to.be.false;
            expect(validateHref("/series/-123/456")).to.be.false;
            expect(validateHref("/series/1b3/456")).to.be.false;
            expect(validateHref("/stories/123")).to.be.false;
            expect(validateHref("/stories/-123/456")).to.be.false;
            expect(validateHref("/stories/1b3/456")).to.be.false;
            expect(validateHref("/volumes/123")).to.be.false;
            expect(validateHref("/volumes/-123/456")).to.be.false;
            expect(validateHref("/volumes/1b3/456")).to.be.false;
        });

        it("should pass on valid hrefs", () => {
            expect(validateHref("/authors/1/2")).to.be.true;
            expect(validateHref("/authors/123/456")).to.be.true;
            expect(validateHref("/base/123")).to.be.true;
            expect(validateHref("/base/1/authors/4")).to.be.true;
            expect(validateHref("/base/1/series/4")).to.be.true;
            expect(validateHref("/base/1/stories/4")).to.be.true;
            expect(validateHref("/base/1/volumes/4")).to.be.true;
            expect(validateHref("/base/123/authors/456")).to.be.true;
            expect(validateHref("/base/123/series/456")).to.be.true;
            expect(validateHref("/base/123/stories/456")).to.be.true;
            expect(validateHref("/base/123/volumes/456")).to.be.true;
            expect(validateHref("/series/1/2")).to.be.true;
            expect(validateHref("/series/123/456")).to.be.true;
            expect(validateHref("/stories/1/2")).to.be.true;
            expect(validateHref("/stories/123/456")).to.be.true;
            expect(validateHref("/volumes/1/2")).to.be.true;
            expect(validateHref("/volumes/123/456")).to.be.true;
        });

    });

});
