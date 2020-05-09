import {BookItem, PreprocessorInput} from "./PreprocessorInput";
import {SimpleSocketDataReader} from "./SimpleSocketDataReader";
import {KeyValueHandler, KeyValueProcessor, PrimitiveObject} from "./Processors/KeyValueProcessor";
import {RegExpHandler, RegExpProcessor} from "./Processors/RegExpProcessor";
import {RawContentHandler, RawContentProcessor} from "./Processors/RawContentProcessor";

class MdBookPreprocessorBuilder {
    private readonly argv: string[];
    private readonly stdout: typeof process.stdout;
    private readonly exitProcess: typeof process.exit;
    private readonly json: typeof JSON;
    private readonly socketReader: SimpleSocketDataReader;

    private readonly keyValueProcessor: KeyValueProcessor;
    private readonly regExpProcessor: RegExpProcessor;
    private readonly rawContentProcessor: RawContentProcessor;

    private rendererSupport: string[] = [];

    /**
     * Creates a new instance of the Preprocessor, using process.argv and stdin for reading mdbook data. An alias
     * for `new Preprocessor()`
     */
    public static builder(): MdBookPreprocessorBuilder {
        return new MdBookPreprocessorBuilder();
    }

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
    constructor(argv = process.argv,
                stdout = process.stdout,
                exitProcess = process.exit,
                json = JSON,
                socketReader = new SimpleSocketDataReader(process.stdin),
                keyValueProcessor = new KeyValueProcessor(),
                regExpProcessor = new RegExpProcessor(),
                rawProcessor = new RawContentProcessor()) {
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
     * Declares support for one or more unique types of renderers.
     *
     * @param rendererStrings - One or more unique renderer names.
     */
    withRendererSupport(...rendererStrings: string[]): MdBookPreprocessorBuilder {
        this.rendererSupport = this.rendererSupport.concat(rendererStrings.map((value) => value.toLowerCase()));
        return this;
    }

    /**
     * Adds a Raw Content Handler, which enables advanced macro matching. These will be executed BEFORE RegExp handlers,
     * and in the order they are added.
     *
     * @param handler
     */
    withRawContentHandler(handler: RawContentHandler): MdBookPreprocessorBuilder {
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
    withRegExpHandler(regExp: RegExp, handler: RegExpHandler): MdBookPreprocessorBuilder {
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
    withKeyValueHandler<T extends PrimitiveObject>(macroName: string, handler: KeyValueHandler<T>): MdBookPreprocessorBuilder {
        this.keyValueProcessor.addHandler(macroName, handler);
        return this;
    }

    /**
     * Readies the Preprocessor for execution, returning a Promise which will resolve once all data has been read,
     * the book processed, and returned to mdbook.
     */
    ready(): Promise<void> {
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
            .then((content: string) => {
                const book = (this.json.parse(content) as PreprocessorInput)[1];
                book.sections = book.sections.map(this.recursivelyProcessChapter);
                this.stdout.write(this.json.stringify(book));
            });
    }

    /**
     * Recursively process the BookItem, and all sub_items, returning the processed BookItem. This modifies the
     * BookItem and Chapter itself, rather than create a new object from the old one.
     */
    private recursivelyProcessChapter = (bookItem: BookItem): BookItem => {
        const chapter = bookItem.Chapter;
        const rawResults = this.rawContentProcessor.execute(chapter);
        const regexResults = this.regExpProcessor.execute(rawResults);
        chapter.content = this.keyValueProcessor.execute(chapter, regexResults);

        if (chapter.sub_items && chapter.sub_items.length > 0) {
            chapter.sub_items = chapter.sub_items.map(this.recursivelyProcessChapter);
        }

        return bookItem;
    };
}

export {MdBookPreprocessorBuilder};
