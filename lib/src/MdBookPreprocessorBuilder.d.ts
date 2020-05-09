/// <reference types="node" />
import { SimpleSocketDataReader } from "./SimpleSocketDataReader";
import { KeyValueHandler, KeyValueProcessor, PrimitiveObject } from "./Processors/KeyValueProcessor";
import { RegExpHandler, RegExpProcessor } from "./Processors/RegExpProcessor";
import { RawContentHandler, RawContentProcessor } from "./Processors/RawContentProcessor";
declare class MdBookPreprocessorBuilder {
    private readonly argv;
    private readonly stdout;
    private readonly exitProcess;
    private readonly json;
    private readonly socketReader;
    private readonly keyValueProcessor;
    private readonly regExpProcessor;
    private readonly rawContentProcessor;
    private rendererSupport;
    /**
     * Creates a new instance of the Preprocessor, using process.argv and stdin for reading mdbook data. An alias
     * for `new Preprocessor()`
     */
    static builder(): MdBookPreprocessorBuilder;
    /**
     * Creates a new instance of the Preprocessor, by default using process.argv and stdin for reading mdbook data.
     *
     * @param {string[]} argv The CLI arguments as exposed by node. By default uses process.argv; may be overridden for testing.
     * @param {WriteStream} stdout The stream to write the final output to.
     * @param {(code: number) => void} exitProcess A function which when called will exit the process. By default uses process.exist; may be overridden for testing.
     * @param {JSON} json The JSON object to use for serializing and deserializing objects.
     * @param {SimpleSocketDataReader} socketReader The SimpleSocketReader used for reading data from stdin; may be overridden for testing or as needed.
     * @param {KeyValueProcessor} keyValueProcessor The processor for managing KeyValue macros; may be overridden for testing.
     * @param {RegExpProcessor} regExpProcessor The processor for managing RegExp macros; may be overridden for testing.
     * @param {RawContentProcessor} rawProcessor The processor for managing raw content; may be overridden for testing.
     */
    constructor(argv?: string[], stdout?: NodeJS.WriteStream, exitProcess?: (code?: number) => never, json?: JSON, socketReader?: SimpleSocketDataReader, keyValueProcessor?: KeyValueProcessor, regExpProcessor?: RegExpProcessor, rawProcessor?: RawContentProcessor);
    /**
     * Declares support for one or more unique types of renderers.
     *
     * @param rendererStrings - One or more unique renderer names.
     */
    withRendererSupport(...rendererStrings: string[]): MdBookPreprocessorBuilder;
    /**
     * Adds a Raw Content Handler, which enables advanced macro matching. These will be executed BEFORE RegExp handlers,
     * and in the order they are added.
     *
     * @param handler
     */
    withRawContentHandler(handler: RawContentHandler): MdBookPreprocessorBuilder;
    /**
     * Adds a Regular Expression Handler, which enables advanced macro matching. These will be executed BEFORE
     * KeyValue handlers, and in the order they are added.
     *
     * @param regExp - The Regular Expression to match upon.
     * @param handler
     */
    withRegExpHandler(regExp: RegExp, handler: RegExpHandler): MdBookPreprocessorBuilder;
    /**
     * Adds a Key Value Handler, which is an easy way to add named macros with key-value pairs. These will be executed
     * AFTER Regexp handlers, and in the order they are added.
     *
     * This expects all key value pairs to be compatible with logfmt: https://godoc.org/github.com/kr/logfmt
     *
     * Example: {{MacroName stringThing=str booleanThing=false boolTrue}}
     * Output: {stringThing: "str", booleanThing: false, boolTrue: true}
     *
     * @param macroName
     * @param handler
     */
    withKeyValueHandler<T extends PrimitiveObject>(macroName: string, handler: KeyValueHandler<T>): MdBookPreprocessorBuilder;
    /**
     * Readies the Preprocessor for execution, returning a Promise which will resolve once all data has been read,
     * the book processed, and returned to mdbook.
     */
    ready(): Promise<void>;
    /**
     * Recursively process the BookItem, and all sub_items, returning the processed BookItem. This modifies the
     * BookItem and Chapter itself, rather than create a new object from the old one.
     */
    private recursivelyProcessChapter;
}
export { MdBookPreprocessorBuilder };
