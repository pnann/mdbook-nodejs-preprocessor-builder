"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MdBookPreprocessorBuilder = void 0;
const SimpleSocketDataReader_1 = require("./SimpleSocketDataReader");
const KeyValueProcessor_1 = require("./Processors/KeyValueProcessor");
const RegExpProcessor_1 = require("./Processors/RegExpProcessor");
const RawContentProcessor_1 = require("./Processors/RawContentProcessor");
class MdBookPreprocessorBuilder {
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
    constructor(argv = process.argv, stdout = process.stdout, exitProcess = process.exit, json = JSON, socketReader = new SimpleSocketDataReader_1.SimpleSocketDataReader(process.stdin), keyValueProcessor = new KeyValueProcessor_1.KeyValueProcessor(), regExpProcessor = new RegExpProcessor_1.RegExpProcessor(), rawProcessor = new RawContentProcessor_1.RawContentProcessor()) {
        this.rendererSupport = [];
        /**
         * Recursively process the BookItem, and all sub_items, returning the processed BookItem. This modifies the
         * BookItem and Chapter itself, rather than create a new object from the old one.
         */
        this.recursivelyProcessChapter = (bookItem) => {
            const chapter = bookItem.Chapter;
            const rawResults = this.rawContentProcessor.execute(chapter);
            const regexResults = this.regExpProcessor.execute(rawResults);
            chapter.content = this.keyValueProcessor.execute(chapter, regexResults);
            if (chapter.sub_items && chapter.sub_items.length > 0) {
                chapter.sub_items = chapter.sub_items.map(this.recursivelyProcessChapter);
            }
            return bookItem;
        };
        this.argv = argv;
        this.stdout = stdout;
        this.exitProcess = exitProcess;
        this.json = json;
        this.socketReader = socketReader;
        this.keyValueProcessor = keyValueProcessor;
        this.regExpProcessor = regExpProcessor;
        this.rawContentProcessor = rawProcessor;
    }
    /**
     * Creates a new instance of the Preprocessor, using process.argv and stdin for reading mdbook data. An alias
     * for `new Preprocessor()`
     */
    static builder() {
        return new MdBookPreprocessorBuilder();
    }
    /**
     * Declares support for one or more unique types of renderers.
     *
     * @param rendererStrings - One or more unique renderer names.
     */
    withRendererSupport(...rendererStrings) {
        this.rendererSupport = this.rendererSupport.concat(rendererStrings.map((value) => value.toLowerCase()));
        return this;
    }
    /**
     * Adds a Raw Content Handler, which enables advanced macro matching. These will be executed BEFORE RegExp handlers,
     * and in the order they are added.
     *
     * @param handler
     */
    withRawContentHandler(handler) {
        this.rawContentProcessor.addHandler(handler);
        return this;
    }
    /**
     * Adds a Regular Expression Handler, which enables advanced macro matching. These will be executed BEFORE
     * KeyValue handlers, and in the order they are added.
     *
     * @param regExp - The Regular Expression to match upon.
     * @param handler
     */
    withRegExpHandler(regExp, handler) {
        this.regExpProcessor.addHandler(regExp, handler);
        return this;
    }
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
    withKeyValueHandler(macroName, handler) {
        this.keyValueProcessor.addHandler(macroName, handler);
        return this;
    }
    /**
     * Readies the Preprocessor for execution, returning a Promise which will resolve once all data has been read,
     * the book processed, and returned to mdbook.
     */
    ready() {
        /*
         * Preprocessors run in two modes:
         *  1. Support Check Mode, where mdBook checks if the preprocessor actually supports the renderer type.
         *  2. Process Mode, where mdBook passes in the entire book for processing.
         */
        if (this.argv[2] === "supports") {
            const rendererType = this.argv[3];
            const supported = rendererType && this.rendererSupport.indexOf(rendererType.toLowerCase()) !== -1;
            this.exitProcess(supported ? 0 : 1);
            return; // NOTE: This exists for testing; in practice, the process will be dead by this line.
        }
        /*
         * Book data comes in chunks, but for now, read everything before processing. This could be adapted to support
         * a streaming JSON parser, but output would still have to be buffered. Probably not worth it.
         */
        return this.socketReader.readAllDataUntilClose()
            .then((content) => {
            const book = this.json.parse(content)[1];
            book.sections = book.sections.map(this.recursivelyProcessChapter);
            this.stdout.write(this.json.stringify(book));
        });
    }
}
exports.MdBookPreprocessorBuilder = MdBookPreprocessorBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWRCb29rUHJlcHJvY2Vzc29yQnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9NZEJvb2tQcmVwcm9jZXNzb3JCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFFQUFnRTtBQUNoRSxzRUFBbUc7QUFDbkcsa0VBQTRFO0FBQzVFLDBFQUF3RjtBQUV4RixNQUFNLHlCQUF5QjtJQXFCM0I7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxZQUFZLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUNuQixNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFDdkIsV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQzFCLElBQUksR0FBRyxJQUFJLEVBQ1gsWUFBWSxHQUFHLElBQUksK0NBQXNCLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUN4RCxpQkFBaUIsR0FBRyxJQUFJLHFDQUFpQixFQUFFLEVBQzNDLGVBQWUsR0FBRyxJQUFJLGlDQUFlLEVBQUUsRUFDdkMsWUFBWSxHQUFHLElBQUkseUNBQW1CLEVBQUU7UUE3QjVDLG9CQUFlLEdBQWEsRUFBRSxDQUFDO1FBdUh2Qzs7O1dBR0c7UUFDSyw4QkFBeUIsR0FBRyxDQUFDLFFBQWtCLEVBQVksRUFBRTtZQUNqRSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO1lBQ2pDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0QsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUQsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUV4RSxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFN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