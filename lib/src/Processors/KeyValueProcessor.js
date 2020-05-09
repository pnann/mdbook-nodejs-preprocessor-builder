"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logfmt = require("logfmt");
class KeyValueProcessor {
    constructor(logfmtParse = logfmt.parse) {
        this.entries = [];
        this.logfmtParse = logfmtParse;
    }
    addHandler(name, handler) {
        if (typeof handler !== "function") {
            throw new Error(`Invalid handler given! Handler must be a function.`);
        }
        if (typeof name !== "string" || name.length === 0) {
            throw new Error(`Invalid macro name of ${name}. Please use a string name of non-zero length`);
        }
        if (this.entries.find((entry) => entry.name === name)) {
            throw new Error(`Cannot add two handlers with the same name! Name: ${name}`);
        }
        this.entries.push({
            name: name,
            regexp: new RegExp(`{{#${name} ?(.*)}}`, "gi"),
            handler: handler
        });
    }
    execute(chapter, content) {
        return this.entries.reduce((previous, entry) => {
            return previous.replace(entry.regexp, ((substring, args) => {
                const matches = args.length === 0 ? {} : this.logfmtParse(args);
                return entry.handler(chapter, matches);
            }));
        }, content);
    }
}
exports.KeyValueProcessor = KeyValueProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5VmFsdWVQcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvUHJvY2Vzc29ycy9LZXlWYWx1ZVByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlDQUFpQztBQXlCakMsTUFBTSxpQkFBaUI7SUFLbkIsWUFBWSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUs7UUFGckIsWUFBTyxHQUFvQixFQUFFLENBQUM7UUFHM0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7SUFDbkMsQ0FBQztJQUVELFVBQVUsQ0FBeUQsSUFBWSxFQUFFLE9BQTJCO1FBQ3hHLElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUN6RTtRQUVELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQy9DLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLElBQUksK0NBQStDLENBQUMsQ0FBQztTQUNqRztRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDbkQsTUFBTSxJQUFJLEtBQUssQ0FBQyxxREFBcUQsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNoRjtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2QsSUFBSSxFQUFFLElBQUk7WUFDVixNQUFNLEVBQUUsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLFVBQVUsRUFBRSxJQUFJLENBQUM7WUFDOUMsT0FBTyxFQUFFLE9BQU87U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELE9BQU8sQ0FBQyxPQUFnQixFQUFFLE9BQWU7UUFDckMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQWdCLEVBQUUsS0FBb0IsRUFBRSxFQUFFO1lBQ2xFLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxTQUFpQixFQUFFLElBQVksRUFBRSxFQUFFO2dCQUN2RSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDUixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBRXdCLDhDQUFpQiJ9