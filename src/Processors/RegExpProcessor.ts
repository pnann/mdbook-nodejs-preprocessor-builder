import {Chapter} from "../PreprocessorInput";

/**
 * A callback function executed when the associated Regular Expression matches. The string returned will replace the
 * fully matched text.
 *
 * @param {Chapter} chapter The Chapter metadata matching the contents given.
 * @param {string} fullMatchedString The full matched string for the RegExp.
 * @param {string[]} matches Individual matches within the RegExp itself.
 *
 * @return {string} The replacement text for the fullMatchedString.
 */
interface RegExpHandler {
    (chapter: Chapter, fullMatchedString: string, ...matches: string[]): string;
}

interface RegExpEntry {
    regExp: RegExp;
    handler: RegExpHandler;
}

class RegExpProcessor {

    private readonly entries: RegExpEntry[] = [];

    addHandler(regExp: RegExp, handler: RegExpHandler): void {
        if (!(regExp instanceof RegExp)) {
            throw new Error(`Invalid regExp type given! Please use a string or RegExp.`);
        }

        this.entries.push({
            regExp: regExp,
            handler: handler
        });
    }

    execute(chapter: Chapter): string {
        return this.entries.reduce((previous: string, entry: RegExpEntry) => {
            // Bind is necessary in order to prepend the chapter, while maintaining the dynamic-args exposed by String.prototype.replace
            return previous.replace(entry.regExp, entry.handler.bind(undefined, chapter));
        }, chapter.content);
    }
}

export {RegExpProcessor, RegExpHandler, RegExpEntry};
