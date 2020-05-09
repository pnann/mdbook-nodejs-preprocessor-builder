"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const umbra_test_1 = require("umbra-test");
const RawContentProcessor_1 = require("../../src/Processors/RawContentProcessor");
describe("RawContentProcessor", () => {
    describe("addHandler", () => {
        it("should throw if the handler isn't a function", (done) => {
            const invalidValues = [undefined, null, "", "value", false, true, {}, 0, 1, []];
            const processor = new RawContentProcessor_1.RawContentProcessor();
            for (const invalidValue of invalidValues) {
                try {
                    processor.addHandler(invalidValue);
                    done(new Error(`Unexpected test failure for macro name of ${invalidValue}`));
                    break;
                }
                catch (error) {
                    // Intentional.
                }
            }
            done();
        });
    });
    describe("execute", () => {
        let rawContentProcessor;
        beforeEach(() => {
            rawContentProcessor = new RawContentProcessor_1.RawContentProcessor();
        });
        function createChapter(content) {
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
            umbra_test_1.assert.equal(inputChapter, outputContent);
        });
        it("should execute a single passed-in handler", () => {
            const handler = umbra_test_1.mock();
            const content = "first-content";
            const inputChapter = createChapter(content);
            const outputChapter = createChapter("second-content");
            umbra_test_1.expect(handler).withArgs(inputChapter).andReturn(outputChapter);
            rawContentProcessor.addHandler(handler);
            const outputContent = rawContentProcessor.execute(inputChapter);
            umbra_test_1.assert.equal(outputChapter, outputContent);
        });
        it("should execute multiple passed-in handlers, in order", () => {
            const first = umbra_test_1.mock();
            const inputChapter = createChapter("first-content");
            const firstOutput = createChapter("second-content");
            umbra_test_1.expect(first).withArgs(inputChapter).andReturn(firstOutput);
            rawContentProcessor.addHandler(first);
            const second = umbra_test_1.mock();
            const secondOutput = createChapter("third-content");
            umbra_test_1.expect(second).withArgs(firstOutput).andReturn(secondOutput);
            rawContentProcessor.addHandler(second);
            const outputContent = rawContentProcessor.execute(inputChapter);
            umbra_test_1.assert.equal(secondOutput, outputContent);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF3Q29udGVudFByb2Nlc3Nvci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdHN0L1Byb2Nlc3NvcnMvUmF3Q29udGVudFByb2Nlc3Nvci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQWdEO0FBR2hELGtGQUFnRztBQUVoRyxRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBRWpDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQ3hCLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3hELE1BQU0sYUFBYSxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDaEYsTUFBTSxTQUFTLEdBQUcsSUFBSSx5Q0FBbUIsRUFBRSxDQUFDO1lBQzVDLEtBQUssTUFBTSxZQUFZLElBQUksYUFBYSxFQUFFO2dCQUN0QyxJQUFJO29CQUNBLFNBQVMsQ0FBQyxVQUFVLENBQUMsWUFBbUIsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsNkNBQTZDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDN0UsTUFBTTtpQkFDVDtnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDWixlQUFlO2lCQUNsQjthQUNKO1lBRUQsSUFBSSxFQUFFLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDckIsSUFBSSxtQkFBd0MsQ0FBQztRQUM3QyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ1osbUJBQW1CLEdBQUcsSUFBSSx5Q0FBbUIsRUFBRSxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FB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