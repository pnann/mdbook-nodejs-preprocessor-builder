"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const umbra_test_1 = require("umbra-test");
const RegExpProcessor_1 = require("../../src/Processors/RegExpProcessor");
describe("RegExpProcessor", () => {
    describe("addHandler", () => {
        it("should throw if the regExp isn't a RegExp", (done) => {
            const invalidValues = [undefined, null, "", "value", false, true, () => null, {}, 0, 1, []];
            const processor = new RegExpProcessor_1.RegExpProcessor();
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
    });
    describe("execute", () => {
        let regExpProcessor;
        let inputChapter;
        beforeEach(() => {
            regExpProcessor = new RegExpProcessor_1.RegExpProcessor();
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
            umbra_test_1.assert.equal("random-content", outputContent);
        });
        it("should execute a single passed-in handler", () => {
            const handler = umbra_test_1.mock();
            const handlerOutput = "some-output";
            umbra_test_1.expect(handler).withArgs(inputChapter, inputChapter.content).andReturn(handlerOutput);
            regExpProcessor.addHandler(/random-content/gi, handler);
            const outputContent = regExpProcessor.execute(inputChapter);
            umbra_test_1.assert.equal(handlerOutput, outputContent);
        });
        it("should execute multiple passed-in handlers, in order", () => {
            const first = umbra_test_1.mock();
            const firstOutput = "first-output";
            umbra_test_1.expect(first).withArgs(inputChapter, inputChapter.content).andReturn(firstOutput);
            regExpProcessor.addHandler(/random-content/gi, first);
            const second = umbra_test_1.mock();
            const secondOutput = "second-output";
            umbra_test_1.expect(second).withArgs(inputChapter, firstOutput).andReturn(secondOutput);
            regExpProcessor.addHandler(/first-output/gi, second);
            const outputContent = regExpProcessor.execute(inputChapter);
            umbra_test_1.assert.equal(secondOutput, outputContent);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVnRXhwUHJvY2Vzc29yLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90c3QvUHJvY2Vzc29ycy9SZWdFeHBQcm9jZXNzb3IudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFnRDtBQUNoRCwwRUFBb0Y7QUFHcEYsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUU3QixRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUN4QixFQUFFLENBQUMsMkNBQTJDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNyRCxNQUFNLGFBQWEsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM1RixNQUFNLFNBQVMsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUN4QyxLQUFLLE1BQU0sWUFBWSxJQUFJLGFBQWEsRUFBRTtnQkFDdEMsSUFBSTtvQkFDQSxTQUFTLENBQUMsVUFBVSxDQUFDLFlBQW1CLEVBQUUsaUJBQUksRUFBRSxDQUFDLENBQUM7b0JBQ2xELElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM3RSxNQUFNO2lCQUNUO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNaLGVBQWU7aUJBQ2xCO2FBQ0o7WUFFRCxJQUFJLEVBQUUsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtRQUNyQixJQUFJLGVBQWdDLENBQUM7UUFDckMsSUFBSSxZQUFxQixDQUFDO1FBQzFCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDWixlQUFlLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7WUFDeEMsWUFBWSxHQUFHO2dCQUNYLElBQUksRUFBRSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxFQUFFO2dCQUNWLFlBQVksRUFBRSxFQUFFO2dCQUNoQixJQUFJLEVBQUUsRUFBRTtnQkFDUixTQUFTLEVBQUUsRUFBRTtnQkFDYixPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1RUFBdUUsRUFBRSxHQUFHLEVBQUU7WUFDN0UsTUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1RCxtQkFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7WUFDakQsTUFBTSxPQUFPLEdBQWtCLGlCQUFJLEVBQUUsQ0FBQztZQUN0QyxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUM7WUFDcEMsbUJBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFdEYsZUFBZSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN4RCxNQUFNLGFBQWEsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVELG1CQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7WUFDNUQsTUFBTSxLQUFLLEdBQWtCLGlCQUFJLEVBQUUsQ0FBQztZQUNwQyxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUM7WUFDbkMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEYsZUFBZSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV0RCxNQUFNLE1BQU0sR0FBa0IsaUJBQUksRUFBRSxDQUFDO1lBQ3JDLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQztZQUVyQyxtQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzNFLGVBQWUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFckQsTUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1RCxtQkFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=