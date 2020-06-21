"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyValueProcessor = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5VmFsdWVQcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvUHJvY2Vzc29ycy9LZXlWYWx1ZVByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBaUM7QUF5QmpDLE1BQU0saUJBQWlCO0lBS25CLFlBQVksV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLO1FBRnJCLFlBQU8sR0FBb0IsRUFBRSxDQUFDO1FBRzNDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ25DLENBQUM7SUFFRCxVQUFVLENBQXlELElBQVksRUFBRSxPQUEyQjtRQUN4RyxJQUFJLE9BQU8sT0FBTyxLQUFLLFVBQVUsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7U0FDekU7UUFFRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMvQyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixJQUFJLCtDQUErQyxDQUFDLENBQUM7U0FDakc7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ25ELE1BQU0sSUFBSSxLQUFLLENBQUMscURBQXFELElBQUksRUFBRSxDQUFDLENBQUM7U0FDaEY7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNkLElBQUksRUFBRSxJQUFJO1lBQ1YsTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUUsSUFBSSxDQUFDO1lBQzlDLE9BQU8sRUFBRSxPQUFPO1NBQ25CLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBZ0IsRUFBRSxPQUFlO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFnQixFQUFFLEtBQW9CLEVBQUUsRUFBRTtZQUNsRSxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsU0FBaUIsRUFBRSxJQUFZLEVBQUUsRUFBRTtnQkFDdkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEUsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQUV3Qiw4Q0FBaUIifQ==