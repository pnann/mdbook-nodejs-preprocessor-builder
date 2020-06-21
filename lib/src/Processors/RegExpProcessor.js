"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegExpProcessor = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVnRXhwUHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1Byb2Nlc3NvcnMvUmVnRXhwUHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXFCQSxNQUFNLGVBQWU7SUFBckI7UUFFcUIsWUFBTyxHQUFrQixFQUFFLENBQUM7SUFtQmpELENBQUM7SUFqQkcsVUFBVSxDQUFDLE1BQWMsRUFBRSxPQUFzQjtRQUM3QyxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVksTUFBTSxDQUFDLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDZCxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxPQUFPO1NBQ25CLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBZ0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQWdCLEVBQUUsS0FBa0IsRUFBRSxFQUFFO1lBQ2hFLDRIQUE0SDtZQUM1SCxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNsRixDQUFDLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7Q0FDSjtBQUVPLDBDQUFlIn0=