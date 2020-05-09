"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF3Q29udGVudFByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9Qcm9jZXNzb3JzL1Jhd0NvbnRlbnRQcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFhQTs7O0dBR0c7QUFDSCxNQUFNLG1CQUFtQjtJQUF6QjtRQUVxQixZQUFPLEdBQXdCLEVBQUUsQ0FBQztJQWV2RCxDQUFDO0lBYkcsVUFBVSxDQUFDLE9BQTBCO1FBQ2pDLElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUN6RTtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBZ0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQWlCLEVBQUUsT0FBMEIsRUFBRSxFQUFFO1lBQ3pFLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFFMEIsa0RBQW1CIn0=