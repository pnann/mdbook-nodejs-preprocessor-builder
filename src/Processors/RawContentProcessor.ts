import {Chapter} from "../PreprocessorInput";

/**
 * A callback function executed for all Chapters. There is no need to modify sub_items, as the handler will be called
 * again for them explicitly.
 *
 * @param {Chapter} chapter The Chapter metadata matching the contents given.
 * @return {string} The replacement Chapter.
 */
interface RawContentHandler {
    (chapter: Chapter): Chapter;
}

/**
 * A processor for executing RawContentHandlers, or those which take and transform the full content without any processing
 * by the builder.
 */
class RawContentProcessor {

    private readonly entries: RawContentHandler[] = [];

    addHandler(handler: RawContentHandler): void {
        if (typeof handler !== "function") {
            throw new Error(`Invalid handler type given! Please use a function.`);
        }

        this.entries.push(handler);
    }

    execute(chapter: Chapter): Chapter {
        return this.entries.reduce((previous: Chapter, handler: RawContentHandler) => {
            return handler(previous);
        }, chapter);
    }
}

export {RawContentHandler, RawContentProcessor};
