"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const umbra_test_1 = require("umbra-test");
const SimpleSocketDataReader_1 = require("../src/SimpleSocketDataReader");
const net_1 = require("net");
describe("SimpleSocketDataReader", () => {
    let socket;
    let dataCapture;
    let errorCapture;
    let closeCapture;
    let dataReader;
    beforeEach(() => {
        socket = umbra_test_1.mock(net_1.Socket);
        dataReader = new SimpleSocketDataReader_1.SimpleSocketDataReader(socket);
        dataCapture = umbra_test_1.newCapture();
        umbra_test_1.expect(socket.on).withArgs("data", dataCapture).once();
        errorCapture = umbra_test_1.newCapture();
        umbra_test_1.expect(socket.on).withArgs("error", errorCapture).once();
        closeCapture = umbra_test_1.newCapture();
        umbra_test_1.expect(socket.on).withArgs("close", closeCapture).once();
        umbra_test_1.expect(socket.off).withArgs("data", umbra_test_1.any()).once();
        umbra_test_1.expect(socket.off).withArgs("error", umbra_test_1.any()).once();
        umbra_test_1.expect(socket.off).withArgs("close", umbra_test_1.any()).once();
    });
    it("should resolve the promise once the close event has been received, even if no data was received", () => {
        const returnedPromise = dataReader.readAllDataUntilClose();
        closeCapture.first();
        return umbra_test_1.assert.resolvesTo(returnedPromise, "");
    });
    it("should resolve the promise once the close event has been received, with data if it was emitted once.", () => {
        const emittedData = "data data data";
        const returnedPromise = dataReader.readAllDataUntilClose();
        dataCapture.first(emittedData);
        closeCapture.first();
        return umbra_test_1.assert.resolvesTo(returnedPromise, emittedData);
    });
    it("should resolve the promise once the close event has been received, with data concatenated if emitted multiple times.", () => {
        const firstData = "data data data";
        const secondData = "more data data data";
        const returnedPromise = dataReader.readAllDataUntilClose();
        dataCapture.first(firstData);
        dataCapture.first(secondData);
        closeCapture.first();
        return umbra_test_1.assert.resolvesTo(returnedPromise, firstData + secondData);
    });
    it("should reject the promise if the error event was emitted", () => {
        const returnedPromise = dataReader.readAllDataUntilClose();
        errorCapture.first();
        return umbra_test_1.assert.rejects(returnedPromise);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2ltcGxlU29ja2V0RGF0YVJlYWRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHN0L1NpbXBsZVNvY2tldERhdGFSZWFkZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUEwRTtBQUUxRSwwRUFBcUU7QUFDckUsNkJBQTJCO0FBRTNCLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsSUFBSSxNQUFNLENBQUM7SUFFWCxJQUFJLFdBQTRDLENBQUM7SUFDakQsSUFBSSxZQUFpQyxDQUFDO0lBQ3RDLElBQUksWUFBaUMsQ0FBQztJQUV0QyxJQUFJLFVBQWtDLENBQUM7SUFFdkMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLE1BQU0sR0FBRyxpQkFBSSxDQUFDLFlBQU0sQ0FBQyxDQUFDO1FBQ3RCLFVBQVUsR0FBRyxJQUFJLCtDQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWhELFdBQVcsR0FBRyx1QkFBVSxFQUFFLENBQUM7UUFDM0IsbUJBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQWEsRUFBRSxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUU5RCxZQUFZLEdBQUcsdUJBQVUsRUFBRSxDQUFDO1FBQzVCLG1CQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFaEUsWUFBWSxHQUFHLHVCQUFVLEVBQUUsQ0FBQztRQUM1QixtQkFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWhFLG1CQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsZ0JBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEQsbUJBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxnQkFBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuRCxtQkFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLGdCQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlHQUFpRyxFQUFFLEdBQUcsRUFBRTtRQUN2RyxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUUzRCxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFckIsT0FBTyxtQkFBTSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0dBQXNHLEVBQUUsR0FBRyxFQUFFO1FBQzVHLE1BQU0sV0FBVyxHQUFHLGdCQUFnQixDQUFDO1FBQ3JDLE1BQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRTNELFdBQVcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0IsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXJCLE9BQU8sbUJBQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzNELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNIQUFzSCxFQUFFLEdBQUcsRUFBRTtRQUM1SCxNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQztRQUNuQyxNQUFNLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQztRQUN6QyxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUUzRCxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUIsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXJCLE9BQU8sbUJBQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDaEUsTUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFFM0QsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXJCLE9BQU8sbUJBQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9