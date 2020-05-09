import {assert, expect, mock} from "umbra-test";

import {KeyValueProcessor} from "../../src/Processors/KeyValueProcessor";
import {Chapter} from "../../src/PreprocessorInput";

describe("KeyValueProcessor", () => {
    describe("addHandler", () => {

        it("should throw if the name is empty, or not a string", (done) => {
            const invalidValues = [undefined, null, "", false, true, () => null, {}, 0, 1, []];
            const processor = new KeyValueProcessor();
            for (const invalidValue of invalidValues) {
                try {
                    processor.addHandler(invalidValue as any, mock());
                    done(new Error(`Unexpected test failure for macro name of ${invalidValue}`));
                    break;
                } catch (error) {
                    // Intentional.
                }
            }

            done();
        });

        it("should throw if the name has already been added", (done) => {
            const processor = new KeyValueProcessor();
            processor.addHandler("name", mock());
            try {
                processor.addHandler("name", mock());
                done(new Error(`Unexpected test failure!`));
            } catch (error) {
                // Intentional.
            }

            done();
        });


        it("should throw if the handler is not a function", (done) => {
            const processor = new KeyValueProcessor(mock());
            const invalidValues = [undefined, null, "", false, true, {}, 0, 1, []];
            for (const invalidValue of invalidValues) {
                try {
                    processor.addHandler("name", invalidValue as any);
                    done(new Error(`Unexpected test failure for macro name of ${invalidValue}`));
                    break;
                } catch (error) {
                    // Intentional.
                }
            }

            done();
        });
    });

    describe("execute", () => {
        let chapter: Chapter;
        let logfmtParse;
        let processor: KeyValueProcessor;

        beforeEach(() => {
            chapter = {
                name: "name",
                content: "content",
                number: [0],
                sub_items: [],
                path: "path",
                parent_names: []
            };
            logfmtParse = mock();
            processor = new KeyValueProcessor(logfmtParse);
        });

        function addHandler(name: string, expectedAttributes: { [key: string]: string | boolean }, output: string): void {
            processor.addHandler(name, (receivedChapter, attributes) => {
                assert.equal(chapter, receivedChapter);
                assert.equal(expectedAttributes, attributes);

                return output;
            });

        }

        function verifyHandler(input: string, expectedOutput: string): void {
            const output = processor.execute(chapter, input);
            assert.equal(expectedOutput, output);
        }

        it("should do nothing if there are no matches", () => {
            processor.addHandler("randomName", mock());

            const input = "random input, no matches";
            const output = processor.execute(chapter, input);

            assert.equal(input, output);
        });

        it("should do nothing if there are other macro names", () => {
            processor.addHandler("randomName", mock());

            const input = "content {{#notActualMacro}} content";
            const output = processor.execute(chapter, input);

            assert.equal(input, output);
        });

        it("should return the passed in content if there are no handlers", () => {
            const input = "content {{#randomName}} content";
            const output = processor.execute(chapter, input);

            assert.equal(input, output);
        });

        it("should execute a single handler without attributes", () => {
            const input = "content {{#randomName}} content";
            const expectedAttributes = {};

            addHandler("randomName", expectedAttributes, "not-content");
            verifyHandler(input, "content not-content content");
        });

        it("should execute multiple handlers", () => {
            const input = "content {{#randomName}} content";
            const expectedAttributes = {};

            addHandler("randomName", expectedAttributes, "not-content");
            verifyHandler(input, "content not-content content");
        });

        it("should pass attributes into logfmt.parse, and blindly return the response to the handler", () => {
            const expectedLogfmtInput = `stuff to=be parsed=123 things=\"are\" how="they are "`;
            const logfmtOutput = {stuff: true}; // Should be blindly returned.
            expect(logfmtParse).withArgs(expectedLogfmtInput).andReturn(logfmtOutput);

            addHandler("randomName", logfmtOutput, "not-content");
            verifyHandler(`content {{#randomName ${expectedLogfmtInput}}} content`, "content not-content content");
        });
    });

});
