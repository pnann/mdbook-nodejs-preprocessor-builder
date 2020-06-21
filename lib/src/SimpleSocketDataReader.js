"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSocketDataReader = void 0;
/**
 * A simple helper class for reading all string data from a socket.
 */
class SimpleSocketDataReader {
    constructor(socket) {
        this.socket = socket;
    }
    /**
     * Reads all data from the socket, batching it until the socket has closed. This promise will only resolve once
     * the socket has been closed.
     */
    readAllDataUntilClose() {
        return new Promise((resolve, reject) => {
            let readData = "";
            const onData = (data) => {
                readData += data;
            };
            this.socket.on("data", onData);
            const onError = (error) => {
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
exports.SimpleSocketDataReader = SimpleSocketDataReader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2ltcGxlU29ja2V0RGF0YVJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TaW1wbGVTb2NrZXREYXRhUmVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBOztHQUVHO0FBQ0gsTUFBTSxzQkFBc0I7SUFJeEIsWUFBWSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxxQkFBcUI7UUFDakIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuQyxJQUFJLFFBQVEsR0FBVyxFQUFFLENBQUM7WUFDMUIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDcEIsUUFBUSxJQUFJLElBQUksQ0FBQztZQUNyQixDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFL0IsTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFZLEVBQUUsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xCLENBQUMsQ0FBQztZQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUVqQyxNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFFTyx3REFBc0IifQ==