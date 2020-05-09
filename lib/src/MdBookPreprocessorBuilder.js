"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWRCb29rUHJlcHJvY2Vzc29yQnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9NZEJvb2tQcmVwcm9jZXNzb3JCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUVBQWdFO0FBQ2hFLHNFQUFtRztBQUNuRyxrRUFBNEU7QUFDNUUsMEVBQXdGO0FBRXhGLE1BQU0seUJBQXlCO0lBcUIzQjs7Ozs7Ozs7Ozs7T0FXRztJQUNILFlBQVksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQ25CLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUN2QixXQUFXLEdBQUcsT0FBTyxDQUFDLElBQUksRUFDMUIsSUFBSSxHQUFHLElBQUksRUFDWCxZQUFZLEdBQUcsSUFBSSwrQ0FBc0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQ3hELGlCQUFpQixHQUFHLElBQUkscUNBQWlCLEVBQUUsRUFDM0MsZUFBZSxHQUFHLElBQUksaUNBQWUsRUFBRSxFQUN2QyxZQUFZLEdBQUcsSUFBSSx5Q0FBbUIsRUFBRTtRQTdCNUMsb0JBQWUsR0FBYSxFQUFFLENBQUM7UUF1SHZDOzs7V0FHRztRQUNLLDhCQUF5QixHQUFHLENBQUMsUUFBa0IsRUFBWSxFQUFFO1lBQ2pFLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7WUFDakMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3RCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5RCxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRXhFLElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25ELE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7YUFDN0U7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUM7UUF4R0UsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBQzNDLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxZQUFZLENBQUM7SUFDNUMsQ0FBQztJQXBDRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsT0FBTztRQUNqQixPQUFPLElBQUkseUJBQXlCLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBZ0NEOzs7O09BSUc7SUFDSCxtQkFBbUIsQ0FBQyxHQUFHLGVBQXlCO1FBQzVDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxxQkFBcUIsQ0FBQyxPQUEwQjtRQUM1QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxpQkFBaUIsQ0FBQyxNQUFjLEVBQUUsT0FBc0I7UUFDcEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILG1CQUFtQixDQUE0QixTQUFpQixFQUFFLE9BQTJCO1FBQ3pGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLO1FBQ0Q7Ozs7V0FJRztRQUNILElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUU7WUFDN0IsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxNQUFNLFNBQVMsR0FBRyxZQUFZLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsT0FBTyxDQUFDLHFGQUFxRjtTQUNoRztRQUVEOzs7V0FHRztRQUNILE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsRUFBRTthQUMzQyxJQUFJLENBQUMsQ0FBQyxPQUFlLEVBQUUsRUFBRTtZQUN0QixNQUFNLElBQUksR0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztDQWtCSjtBQUVPLDhEQUF5QiJ9