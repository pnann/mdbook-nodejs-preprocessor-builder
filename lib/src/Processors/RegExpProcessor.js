"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegExpProcessor {
    constructor() {
        this.entries = [];
    }
    addHandler(regExp, handler) {
        if (!(regExp instanceof RegExp)) {
            throw new Error(`Invalid regExp type given! Please use a string or RegExp.`);
        }
        this.entries.push({
            regExp: regExp,
            handler: handler
        });
    }
    execute(chapter) {
        return this.entries.reduce((previous, entry) => {
            // Bind is necessary in order to prepend the chapter, while maintaining the dynamic-args exposed by String.prototype.replace
            return previous.replace(entry.regExp, entry.handler.bind(undefined, chapter));
        }, chapter.content);
    }
}
exports.RegExpProcessor = RegExpProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVnRXhwUHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1Byb2Nlc3NvcnMvUmVnRXhwUHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBcUJBLE1BQU0sZUFBZTtJQUFyQjtRQUVxQixZQUFPLEdBQWtCLEVBQUUsQ0FBQztJQW1CakQsQ0FBQztJQWpCRyxVQUFVLENBQUMsTUFBYyxFQUFFLE9BQXNCO1FBQzdDLElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxNQUFNLENBQUMsRUFBRTtZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7U0FDaEY7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNkLE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFLE9BQU87U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELE9BQU8sQ0FBQyxPQUFnQjtRQUNwQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBZ0IsRUFBRSxLQUFrQixFQUFFLEVBQUU7WUFDaEUsNEhBQTRIO1lBQzVILE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEIsQ0FBQztDQUNKO0FBRU8sMENBQWUifQ==