"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const umbra_test_1 = require("umbra-test");
const KeyValueProcessor_1 = require("../../src/Processors/KeyValueProcessor");
describe("KeyValueProcessor", () => {
    describe("addHandler", () => {
        it("should throw if the name is empty, or not a string", (done) => {
            const invalidValues = [undefined, null, "", false, true, () => null, {}, 0, 1, []];
            const processor = new KeyValueProcessor_1.KeyValueProcessor();
            for (const invalidValue of invalidValues) {
                try {
                    processor.addHandler(invalidValue, umbra_test_1.mock());
                    done(new Error(`Unexpected test failure for macro name of ${invalidValue}`));
                    break;
                }
                catch (error) {
                    // Intentional.
                }
            }
            done();
        });
        it("should throw if the name has already been added", (done) => {
            const processor = new KeyValueProcessor_1.KeyValueProcessor();
            processor.addHandler("name", umbra_test_1.mock());
            try {
                processor.addHandler("name", umbra_test_1.mock());
                done(new Error(`Unexpected test failure!`));
            }
            catch (error) {
                // Intentional.
            }
            done();
        });
        it("should throw if the handler is not a function", (done) => {
            const processor = new KeyValueProcessor_1.KeyValueProcessor(umbra_test_1.mock());
            const invalidValues = [undefined, null, "", false, true, {}, 0, 1, []];
            for (const invalidValue of invalidValues) {
                try {
                    processor.addHandler("name", invalidValue);
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
        let chapter;
        let logfmtParse;
        let processor;
        beforeEach(() => {
            chapter = {
                name: "name",
                content: "content",
                number: [0],
                sub_items: [],
                path: "path",
                parent_names: []
            };
            logfmtParse = umbra_test_1.mock();
            processor = new KeyValueProcessor_1.KeyValueProcessor(logfmtParse);
        });
        function addHandler(name, expectedAttributes, output) {
            processor.addHandler(name, (receivedChapter, attributes) => {
                umbra_test_1.assert.equal(chapter, receivedChapter);
                umbra_test_1.assert.equal(expectedAttributes, attributes);
                return output;
            });
        }
        function verifyHandler(input, expectedOutput) {
            const output = processor.execute(chapter, input);
            umbra_test_1.assert.equal(expectedOutput, output);
        }
        it("should do nothing if there are no matches", () => {
            processor.addHandler("randomName", umbra_test_1.mock());
            const input = "random input, no matches";
            const output = processor.execute(chapter, input);
            umbra_test_1.assert.equal(input, output);
        });
        it("should do nothing if there are other macro names", () => {
            processor.addHandler("randomName", umbra_test_1.mock());
            const input = "content {{#notActualMacro}} content";
            const output = processor.execute(chapter, input);
            umbra_test_1.assert.equal(input, output);
        });
        it("should return the passed in content if there are no handlers", () => {
            const input = "content {{#randomName}} content";
            const output = processor.execute(chapter, input);
            umbra_test_1.assert.equal(input, output);
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
            const logfmtOutput = { stuff: true }; // Should be blindly returned.
            umbra_test_1.expect(logfmtParse).withArgs(expectedLogfmtInput).andReturn(logfmtOutput);
            addHandler("randomName", logfmtOutput, "not-content");
            verifyHandler(`content {{#randomName ${expectedLogfmtInput}}} content`, "content not-content content");
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5VmFsdWVQcm9jZXNzb3IudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3RzdC9Qcm9jZXNzb3JzL0tleVZhbHVlUHJvY2Vzc29yLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBZ0Q7QUFFaEQsOEVBQXlFO0FBR3pFLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFFeEIsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDOUQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNuRixNQUFNLFNBQVMsR0FBRyxJQUFJLHFDQUFpQixFQUFFLENBQUM7WUFDMUMsS0FBSyxNQUFNLFlBQVksSUFBSSxhQUFhLEVBQUU7Z0JBQ3RDLElBQUk7b0JBQ0EsU0FBUyxDQUFDLFVBQVUsQ0FBQyxZQUFtQixFQUFFLGlCQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUNsRCxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsNkNBQTZDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDN0UsTUFBTTtpQkFDVDtnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDWixlQUFlO2lCQUNsQjthQUNKO1lBRUQsSUFBSSxFQUFFLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzNELE1BQU0sU0FBUyxHQUFHLElBQUkscUNBQWlCLEVBQUUsQ0FBQztZQUMxQyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxpQkFBSSxFQUFFLENB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