import {any, assert, Capture, expect, mock, newCapture} from "umbra-test";

import {SimpleSocketDataReader} from "../src/SimpleSocketDataReader";
import {Socket} from "net";

describe("SimpleSocketDataReader", () => {
    let socket;

    let dataCapture: Capture<(data: string) => void>;
    let errorCapture: Capture<() => void>;
    let closeCapture: Capture<() => void>;

    let dataReader: SimpleSocketDataReader;

    beforeEach(() => {
        socket = mock(Socket);
        dataReader = new SimpleSocketDataReader(socket);

        dataCapture = newCapture();
        expect(socket.on).withArgs("data" as any, dataCapture).once();

        errorCapture = newCapture();
        expect(socket.on).withArgs("error" as any, errorCapture).once();

        closeCapture = newCapture();
        expect(socket.on).withArgs("close" as any, closeCapture).once();

        expect(socket.off).withArgs("data", any()).once();
        expect(socket.off).withArgs("error", any()).once();
        expect(socket.off).withArgs("close", any()).once();
    });

    it("should resolve the promise once the close event has been received, even if no data was received", () => {
        const returnedPromise = dataReader.readAllDataUntilClose();

        closeCapture.first();

        return assert.resolvesTo(returnedPromise, "");
    });

    it("should resolve the promise once the close event has been received, with data if it was emitted once.", () => {
        const emittedData = "data data data";
        const returnedPromise = dataReader.readAllDataUntilClose();

        dataCapture.first(emittedData);
        closeCapture.first();

        return assert.resolvesTo(returnedPromise, emittedData);
    });

    it("should resolve the promise once the close event has been received, with data concatenated if emitted multiple times.", () => {
        const firstData = "data data data";
        const secondData = "more data data data";
        const returnedPromise = dataReader.readAllDataUntilClose();

        dataCapture.first(firstData);
        dataCapture.first(secondData);
        closeCapture.first();

        return assert.resolvesTo(returnedPromise, firstData + secondData);
    });

    it("should reject the promise if the error event was emitted", () => {
        const returnedPromise = dataReader.readAllDataUntilClose();

        errorCapture.first();

        return assert.rejects(returnedPromise);
    });
});
