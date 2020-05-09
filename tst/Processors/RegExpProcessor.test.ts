import {assert, expect, mock} from "umbra-test";
import {RegExpHandler, RegExpProcessor} from "../../src/Processors/RegExpProcessor";
import {Chapter} from "../../src/PreprocessorInput";

describe("RegExpProcessor", () => {

    describe("addHandler", () => {
        it("should throw if the regExp isn't a RegExp", (done) => {
            const invalidValues = [undefined, null, "", "value", false, true, () => null, {}, 0, 1, []];
            const processor = new RegExpProcessor();
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
    });

    describe("execute", () => {
        let regExpProcessor: RegExpProcessor;
        let inputChapter: Chapter;
        beforeEach(() => {
            regExpProcessor = new RegExpProcessor();
            inputChapter = {
                name: "",
                number: [],
                parent_names: [],
                path: "",
                sub_items: [],
                content: "random-content"
            };
        });

        it("should return the chapter content passed in, if there are no handlers", () => {
            const outputContent = regExpProcessor.execute(inputChapter);
            assert.equal("random-content", outputContent);
        });

        it("should execute a single passed-in handler", () => {
            const handler: RegExpHandler = mock();
            const handlerOutput = "some-output";
            expect(handler).withArgs(inputChapter, inputChapter.content).andReturn(handlerOutput);

            regExpProcessor.addHandler(/random-content/gi, handler);
            const outputContent = regExpProcessor.execute(inputChapter);
            assert.equal(handlerOutput, outputContent);
        });

        it("should execute multiple passed-in handlers, in order", () => {
            const first: RegExpHandler = mock();
            const firstOutput = "first-output";
            expect(first).withArgs(inputChapter, inputChapter.content).andReturn(firstOutput);
            regExpProcessor.addHandler(/random-content/gi, first);

            const second: RegExpHandler = mock();
            const secondOutput = "second-output";

            expect(second).withArgs(inputChapter, firstOutput).andReturn(secondOutput);
            regExpProcessor.addHandler(/first-output/gi, second);

            const outputContent = regExpProcessor.execute(inputChapter);
            assert.equal(secondOutput, outputContent);
        });
    });
});
