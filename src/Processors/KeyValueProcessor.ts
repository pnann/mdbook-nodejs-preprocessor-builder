import {Chapter} from "../PreprocessorInput";
import * as logfmt from "logfmt";

interface PrimitiveObject {
    [key: string]: string | number | boolean
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

interface KeyValueEntry {
    name: string;
    regexp: RegExp;
    handler: KeyValueHandler<any>;
}

class KeyValueProcessor {

    private readonly logfmtParse: typeof logfmt.parse;
    private readonly entries: KeyValueEntry[] = [];

    constructor(logfmtParse = logfmt.parse) {
        this.logfmtParse = logfmtParse;
    }

    addHandler<T extends { [key: string]: string | number | boolean }>(name: string, handler: KeyValueHandler<T>): void {
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

    execute(chapter: Chapter, content: string): string {
        return this.entries.reduce((previous: string, entry: KeyValueEntry) => {
            return previous.replace(entry.regexp, ((substring: string, args: string) => {
                const matches = args.length === 0 ? {} : this.logfmtParse(args);
                return entry.handler(chapter, matches);
            }));
        }, content);
    }
}

export {KeyValueHandler, KeyValueProcessor, PrimitiveObject};
