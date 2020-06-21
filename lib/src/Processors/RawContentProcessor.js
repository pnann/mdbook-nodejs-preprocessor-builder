"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawContentProcessor = void 0;
/**
 * A processor for executing RawContentHandlers, or those which take and transform the full content without any processing
 * by the builder.
 */
class RawContentProcessor {
    constructor() {
        this.entries = [];
    }
    addHandler(handler) {
        if (typeof handler !== "function") {
            throw new Error(`Invalid handler type given! Please use a function.`);
        }
        this.entries.push(handler);
    }
    execute(chapter) {
        return this.entries.reduce((previous, handler) => {
            return handler(previous);
        }, chapter);
    }
}
exports.RawContentProcessor = RawContentProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF3Q29udGVudFByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9Qcm9jZXNzb3JzL1Jhd0NvbnRlbnRQcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBYUE7OztHQUdHO0FBQ0gsTUFBTSxtQkFBbUI7SUFBekI7UUFFcUIsWUFBTyxHQUF3QixFQUFFLENBQUM7SUFldkQsQ0FBQztJQWJHLFVBQVUsQ0FBQyxPQUEwQjtRQUNqQyxJQUFJLE9BQU8sT0FBTyxLQUFLLFVBQVUsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7U0FDekU7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsT0FBTyxDQUFDLE9BQWdCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFpQixFQUFFLE9BQTBCLEVBQUUsRUFBRTtZQUN6RSxPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBRTBCLGtEQUFtQiJ9