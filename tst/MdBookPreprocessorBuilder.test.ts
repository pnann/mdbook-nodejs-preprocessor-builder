import {assert, expect, mock} from "umbra-test";

import {MdBookPreprocessorBuilder} from "../src/MdBookPreprocessorBuilder";
import {RegExpHandler, RegExpProcessor} from "../src/Processors/RegExpProcessor";
import {SimpleSocketDataReader} from "../src/SimpleSocketDataReader";
import {KeyValueHandler, KeyValueProcessor} from "../src/Processors/KeyValueProcessor";
import {Book, Chapter} from "../src/PreprocessorInput";
import {RawContentHandler, RawContentProcessor} from "../src/Processors/RawContentProcessor";

describe("MdBookPreprocessorBuilder", () => {

    let argv: string[];
    let stdout: typeof process.stdout;
    let exitProcess: typeof process.exit;
    let json: JSON;

    let socketReader: SimpleSocketDataReader;
    let keyValueProcessor: KeyValueProcessor;
    let regExpProcessor: RegExpProcessor;
    let rawContentProcessor: RawContentProcessor;

    let builder: MdBookPreprocessorBuilder;

    beforeEach(() => {
        argv = [];
        stdout = mock();
        exitProcess = mock();
        json = mock();
        socketReader = mock();
        keyValueProcessor = mock();
        regExpProcessor = mock();
        rawContentProcessor = mock();

        builder = new MdBookPreprocessorBuilder(argv, stdout, exitProcess, json, socketReader, keyValueProcessor, regExpProcessor, rawContentProcessor);
    });

    describe("withRendererSupport", () => {
        it("should throw if non-string values are given", (done) => {
            const invalidValues = [undefined, null, false, true, () => null, {}, 0, 1, []];
            const builder = new MdBookPreprocessorBuilder();
            for (const invalidValue of invalidValues) {
                try {
                    builder.withRendererSupport(invalidValue as any);
                    done(new Error(`Unexpected test failure for renderer name of ${invalidValue}`));
                    break;
                } catch (error) {
                    // Intentional.
                }
            }

            done();
        });
    });

    describe("builder", () => {
        it("should return a default instance of the Builder", () => {
            const builder = MdBookPreprocessorBuilder.builder();
            assert.isTrue(builder instanceof MdBookPreprocessorBuilder);
        });
    });

    describe("withRawContentHandler", () => {
        it("should pass the values directly to the RawContentProcessor", () => {
            const handler: RawContentHandler = mock();
            expect(rawContentProcessor.addHandler).withArgs(handler);

            builder.withRawContentHandler(handler);
        });
    });

    describe("withRegExpHandler", () => {
        it("should pass the values directly to the RegExpProcessor", () => {
            const regExp = /some-random-regexp/gi;
            const handler: RegExpHandler = mock();
            expect(regExpProcessor.addHandler).withArgs(regExp, handler);

            builder.withRegExpHandler(regExp, handler);
        });
    });

    describe("withKeyValueHandler", () => {
        it("should pass the values directly to the KeyValueProcessor", () => {
            const macroName = "macro-name";
            const handler: KeyValueHandler<{}> = mock();
            expect(keyValueProcessor.addHandler).withArgs(macroName, handler);

            builder.withKeyValueHandler(macroName, handler);
        });
    });

    describe("support mode", () => {
        beforeEach(() => {
            argv.push("node", "index.js", "supports", "html");
        });

        it("should exit with code 1 if the requested type wasn't added", () => {
            argv.pop();
            expect(exitProcess).withArgs(1);
            return builder.ready();
        });

        it("should exit with code 1 if no renderer support was added", () => {
            expect(exitProcess).withArgs(1);
            return builder.ready();
        });

        it("should exit with code 0 if only one type was added, and it matches", () => {
            builder.withRendererSupport("html");
            expect(exitProcess).withArgs(0);
            return builder.ready();
        });

        it("should exit with code 0 if multiple types were added, and one matches", () => {
            builder.withRendererSupport("md", "xml", "html");
            expect(exitProcess).withArgs(0);
            return builder.ready();
        });

        it("should exit with code 0 if the type matches, regardless of casing", () => {
            builder.withRendererSupport("md", "xml", "HtMl");
            expect(exitProcess).withArgs(0);
            return builder.ready();
        });
    });

    describe("process mode", () => {
        let chapter: Chapter;
        let subChapter: Chapter;
        let bookContent: Book;

        const newChapter = (content: string) => ({
            content: content, name: "", number: [], parent_names: [], path: "", sub_items: []
        });

        const newBook = (...chapters: Chapter[]) => ({
            sections: chapters.map(() => ({Chapter: chapter}))
        });

        beforeEach(() => {
            chapter = newChapter("random-content");
            bookContent = newBook(chapter);

            const inputString = "final-string";
            expect(json.parse).withArgs(inputString).andReturn([{}, bookContent]);
            expect(socketReader.readAllDataUntilClose).andResolve(inputString);
        });

        it("should execute RawContent, RegExp and KeyValue processors", () => {
            expect(rawContentProcessor.execute).withArgs(chapter).andReturn(chapter);
            expect(regExpProcessor.execute).withArgs(chapter).andReturn("regExp-content");
            expect(keyValueProcessor.execute).withArgs(chapter, "regExp-content").andReturn("new-content");
            const expectedBook = newBook(newChapter("new-content"));

            const finalString = "final-string";
            expect(json.stringify).withArgs(expectedBook).andReturn(finalString);
            expect(stdout.write).withArgs(finalString);

            return builder.ready();
        });

        it("should execute RawContent, RegExp and KeyValue processors, even if no sub_items", () => {
            expect(rawContentProcessor.execute).withArgs(chapter).andReturn(chapter);
            expect(regExpProcessor.execute).withArgs(chapter).andReturn("regExp-content");
            expect(keyValueProcessor.execute).withArgs(chapter, "regExp-content").andReturn("new-content");
            chapter.content = "new-content";

            const finalString = "final-string";
            expect(json.stringify).withArgs(bookContent).andReturn(finalString);
            expect(stdout.write).withArgs(finalString);

            return builder.ready();
        });

        it("should also update sub_items", () => {
            subChapter = newChapter("sub-content");
            chapter.sub_items.push({Chapter: subChapter});

            // Primary Content
            expect(rawContentProcessor.execute).withArgs(chapter).andReturn(chapter);
            expect(regExpProcessor.execute).withArgs(chapter).andReturn("regExp-content");
            expect(keyValueProcessor.execute).withArgs(chapter, "regExp-content").andReturn("new-content");

            // Sub content
            expect(rawContentProcessor.execute).withArgs(subChapter).andReturn(subChapter);
            expect(regExpProcessor.execute).withArgs(subChapter).andReturn("regExp-sub-content");
            expect(keyValueProcessor.execute).withArgs(subChapter, "regExp-sub-content").andReturn("new-sub-content");

            const expectedTopChapter = newChapter("new-content");
            expectedTopChapter.sub_items.push(newChapter("new-sub-content"));
            const expectedBook = newBook(expectedTopChapter);

            const finalString = "final-string";
            expect(json.stringify).withArgs(expectedBook).andReturn(finalString);
            expect(stdout.write).withArgs(finalString);

            return builder.ready();
        });
    });
});
