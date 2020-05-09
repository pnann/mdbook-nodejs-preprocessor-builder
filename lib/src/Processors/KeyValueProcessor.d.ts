import { Chapter } from "../PreprocessorInput";
interface PrimitiveObject {
    [key: string]: string | number | boolean;
}
/**
 * A callback function executed when the associated macro name matches. The string returned will replace the
 * fully matched text.
 *
 * @param {Chapter} chapter The Chapter metadata matching the contents given.
 * @param {{ [key: string]: string }} matches A map of attribute keys to values associated with the macro.
 *
 * @return {string} The replacement text for the fullMatchedString.
 */
interface KeyValueHandler<T extends PrimitiveObject> {
    (chapter: Chapter, matches: T): string;
}
declare class KeyValueProcessor {
    private readonly logfmtParse;
    private readonly entries;
    constructor(logfmtParse?: (line: string) => object);
    addHandler<T extends {
        [key: string]: string | number | boolean;
    }>(name: string, handler: KeyValueHandler<T>): void;
    execute(chapter: Chapter, content: string): string;
}
export { KeyValueHandler, KeyValueProcessor, PrimitiveObject };
