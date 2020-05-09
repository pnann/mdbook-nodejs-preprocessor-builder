import {assert, expect, mock} from "umbra-test";
import {RegExpHandler} from "../../src/Processors/RegExpProcessor";
import {Chapter} from "../../src/PreprocessorInput";
import {RawContentHandler, RawContentProcessor} from "../../src/Processors/RawContentProcessor";

describe("RawContentProcessor", () => {

    describe("addHandler", () => {
        it("should throw if the handler isn't a function", (done) => {
            const invalidValues = [undefined, null, "", "value", false, true, {}, 0, 1, []];
            const processor = new RawContentProcessor();
            for (const invalidValue of invalidValues) {
                try {
                    processor.addHandler(invalidValue as any);
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
        let rawContentProcessor: RawContentProcessor;
        beforeEach(() => {
            rawContentProcessor = new RawContentProcessor();
        });

        function createChapter(content: string) {
            return {
                name: "",
                number: [],
                parent_names: [],
                path: "",
                sub_items: [],
                content: content
            };
        }

        it("should return the chapter content passed in, if there are no handlers", () => {
            const inputChapter = createChapter("first-content");
            const outputContent = rawContentProcessor.execute(inputChapter);
            assert.equal(inputChapter, outputContent);
        });

        it("should execute a single passed-in handler", () => {
            const handler: RawContentHandler = mock();
            const content = "first-content";
            const inputChapter = createChapter(content);
            const outputChapter = createChapter("second-content");
            expect(handler).withArgs(inputChapter).andReturn(outputChapter);

            rawContentProcessor.addHandler(handler);
            const outputContent = rawContentProcessor.execute(inputChapter);
            assert.equal(outputChapter, outputContent);
        });

        it("should execute multiple passed-in handlers, in order", () => {
            const first: RawContentHandler = mock();
            const inputChapter = createChapter("first-content");
            const firstOutput = createChapter("second-content");
            expect(first).withArgs(inputChapter).andReturn(firstOutput);
            rawContentProcessor.addHandler(first);

            const second: RawContentHandler = mock();
            const secondOutput = createChapter("third-content");
            expect(second).withArgs(firstOutput).andReturn(secondOutput);
            rawContentProcessor.addHandler(second);

            const outputContent = rawContentProcessor.execute(inputChapter);
            assert.equal(secondOutput, outputContent);
        });
    });
});
