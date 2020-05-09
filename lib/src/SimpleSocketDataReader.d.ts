/// <reference types="node" />
import { Socket } from "net";
/**
 * A simple helper class for reading all string data from a socket.
 */
declare class SimpleSocketDataReader {
    private readonly socket;
    constructor(socket: Socket);
    /**
     * Reads all data from the socket, batching it until the socket has closed. This promise will only resolve once
     * the socket has been closed.
     */
    readAllDataUntilClose(): Promise<string>;
}
export { SimpleSocketDataReader };
