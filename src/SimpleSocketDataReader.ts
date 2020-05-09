import {Socket} from "net";

/**
 * A simple helper class for reading all string data from a socket.
 */
class SimpleSocketDataReader {

    private readonly socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    /**
     * Reads all data from the socket, batching it until the socket has closed. This promise will only resolve once
     * the socket has been closed.
     */
    readAllDataUntilClose(): Promise<string> {
        return new Promise((resolve, reject) => {
            let readData: string = "";
            const onData = (data) => {
                readData += data;
            };
            this.socket.on("data", onData);

            const onError = (error: Error) => {
                this.socket.off("data", onData);
                this.socket.off("error", onError);
                this.socket.off("close", onClose);
                reject(error);
            };
            this.socket.on("error", onError);

            const onClose = () => {
                this.socket.off("data", onData);
                this.socket.off("error", onError);
                this.socket.off("close", onClose);
                resolve(readData);
            };
            this.socket.on("close", onClose);
        });
    }
}

export {SimpleSocketDataReader};
