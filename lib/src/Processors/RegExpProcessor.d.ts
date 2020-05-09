import { Chapter } from "../PreprocessorInput";
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
declare class RegExpProcessor {
    private readonly entries;
    addHandler(regExp: RegExp, handler: RegExpHandler): void;
    execute(chapter: Chapter): string;
}
export { RegExpProcessor, RegExpHandler, RegExpEntry };
