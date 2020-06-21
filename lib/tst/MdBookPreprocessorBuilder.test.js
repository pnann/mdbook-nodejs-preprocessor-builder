"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const umbra_test_1 = require("umbra-test");
const MdBookPreprocessorBuilder_1 = require("../src/MdBookPreprocessorBuilder");
describe("MdBookPreprocessorBuilder", () => {
    let argv;
    let stdout;
    let exitProcess;
    let json;
    let socketReader;
    let keyValueProcessor;
    let regExpProcessor;
    let rawContentProcessor;
    let builder;
    beforeEach(() => {
        argv = [];
        stdout = umbra_test_1.mock();
        exitProcess = umbra_test_1.mock();
        json = umbra_test_1.mock();
        socketReader = umbra_test_1.mock();
        keyValueProcessor = umbra_test_1.mock();
        regExpProcessor = umbra_test_1.mock();
        rawContentProcessor = umbra_test_1.mock();
        builder = new MdBookPreprocessorBuilder_1.MdBookPreprocessorBuilder(argv, stdout, exitProcess, json, socketReader, keyValueProcessor, regExpProcessor, rawContentProcessor);
    });
    describe("withRendererSupport", () => {
        it("should throw if non-string values are given", (done) => {
            const invalidValues = [undefined, null, false, true, () => null, {}, 0, 1, []];
            const builder = new MdBookPreprocessorBuilder_1.MdBookPreprocessorBuilder();
            for (const invalidValue of invalidValues) {
                try {
                    builder.withRendererSupport(invalidValue);
                    done(new Error(`Unexpected test failure for renderer name of ${invalidValue}`));
                    break;
                }
                catch (error) {
                    // Intentional.
                }
            }
            done();
        });
    });
    describe("builder", () => {
        it("should return a default instance of the Builder", () => {
            const builder = MdBookPreprocessorBuilder_1.MdBookPreprocessorBuilder.builder();
            umbra_test_1.assert.isTrue(builder instanceof MdBookPreprocessorBuilder_1.MdBookPreprocessorBuilder);
        });
    });
    describe("withRawContentHandler", () => {
        it("should pass the values directly to the RawContentProcessor", () => {
            const handler = umbra_test_1.mock();
            umbra_test_1.expect(rawContentProcessor.addHandler).withArgs(handler);
            builder.withRawContentHandler(handler);
        });
    });
    describe("withRegExpHandler", () => {
        it("should pass the values directly to the RegExpProcessor", () => {
            const regExp = /some-random-regexp/gi;
            const handler = umbra_test_1.mock();
            umbra_test_1.expect(regExpProcessor.addHandler).withArgs(regExp, handler);
            builder.withRegExpHandler(regExp, handler);
        });
    });
    describe("withKeyValueHandler", () => {
        it("should pass the values directly to the KeyValueProcessor", () => {
            const macroName = "macro-name";
            const handler = umbra_test_1.mock();
            umbra_test_1.expect(keyValueProcessor.addHandler).withArgs(macroName, handler);
            builder.withKeyValueHandler(macroName, handler);
        });
    });
    describe("support mode", () => {
        beforeEach(() => {
            argv.push("node", "index.js", "supports", "html");
        });
        it("should exit with code 1 if the requested type wasn't added", () => {
            argv.pop();
            umbra_test_1.expect(exitProcess).withArgs(1);
            return builder.ready();
        });
        it("should exit with code 1 if no renderer support was added", () => {
            umbra_test_1.expect(exitProcess).withArgs(1);
            return builder.ready();
        });
        it("should exit with code 0 if only one type was added, and it matches", () => {
            builder.withRendererSupport("html");
            umbra_test_1.expect(exitProcess).withArgs(0);
            return builder.ready();
        });
        it("should exit with code 0 if multiple types were added, and one matches", () => {
            builder.withRendererSupport("md", "xml", "html");
            umbra_test_1.expect(exitProcess).withArgs(0);
            return builder.ready();
        });
        it("should exit with code 0 if the type matches, regardless of casing", () => {
            builder.withRendererSupport("md", "xml", "HtMl");
            umbra_test_1.expect(exitProcess).withArgs(0);
            return builder.ready();
        });
    });
    describe("process mode", () => {
        let chapter;
        let subChapter;
        let bookContent;
        const newChapter = (content) => ({
            content: content, name: "", number: [], parent_names: [], path: "", sub_items: []
        });
        const newBook = (...chapters) => ({
            sections: chapters.map(() => ({ Chapter: chapter }))
        });
        beforeEach(() => {
            chapter = newChapter("random-content");
            bookContent = newBook(chapter);
            const inputString = "final-string";
            umbra_test_1.expect(json.parse).withArgs(inputString).andReturn([{}, bookContent]);
            umbra_test_1.expect(socketReader.readAllDataUntilClose).andResolve(inputString);
        });
        it("should execute RawContent, RegExp and KeyValue processors", () => {
            umbra_test_1.expect(rawContentProcessor.execute).withArgs(chapter).andReturn(chapter);
            umbra_test_1.expect(regExpProcessor.execute).withArgs(chapter).andReturn("regExp-content");
            umbra_test_1.expect(keyValueProcessor.execute).withArgs(chapter, "regExp-content").andReturn("new-content");
            const expectedBook = newBook(newChapter("new-content"));
            const finalString = "final-string";
            umbra_test_1.expect(json.stringify).withArgs(expectedBook).andReturn(finalString);
            umbra_test_1.expect(stdout.write).withArgs(finalString);
            return builder.ready();
        });
        it("should execute RawContent, RegExp and KeyValue processors, even if no sub_items", () => {
            umbra_test_1.expect(rawContentProcessor.execute).withArgs(chapter).andReturn(chapter);
            umbra_test_1.expect(regExpProcessor.execute).withArgs(chapter).andReturn("regExp-content");
            umbra_test_1.expect(keyValueProcessor.execute).withArgs(chapter, "regExp-content").andReturn("new-content");
            chapter.content = "new-content";
            const finalString = "final-string";
            umbra_test_1.expect(json.stringify).withArgs(bookContent).andReturn(finalString);
            umbra_test_1.expect(stdout.write).withArgs(finalString);
            return builder.ready();
        });
        it("should also update sub_items", () => {
            subChapter = newChapter("sub-content");
            chapter.sub_items.push({ Chapter: subChapter });
            // Primary Content
            umbra_test_1.expect(rawContentProcessor.execute).withArgs(chapter).andReturn(chapter);
            umbra_test_1.expect(regExpProcessor.execute).withArgs(chapter).andReturn("regExp-content");
            umbra_test_1.expect(keyValueProcessor.execute).withArgs(chapter, "regExp-content").andReturn("new-content");
            // Sub content
            umbra_test_1.expect(rawContentProcessor.execute).withArgs(subChapter).andReturn(subChapter);
            umbra_test_1.expect(regExpProcessor.execute).withArgs(subChapter).andReturn("regExp-sub-content");
            umbra_test_1.expect(keyValueProcessor.execute).withArgs(subChapter, "regExp-sub-content").andReturn("new-sub-content");
            const expectedTopChapter = newChapter("new-content");
            expectedTopChapter.sub_items.push(newChapter("new-sub-content"));
            const expectedBook = newBook(expectedTopChapter);
            const finalString = "final-string";
            umbra_test_1.expect(json.stringify).withArgs(expectedBook).andReturn(finalString);
            umbra_test_1.expect(stdout.write).withArgs(finalString);
            return builder.ready();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWRCb29rUHJlcHJvY2Vzc29yQnVpbGRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHN0L01kQm9va1ByZXByb2Nlc3NvckJ1aWxkZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFnRDtBQUVoRCxnRkFBMkU7QUFPM0UsUUFBUSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUV2QyxJQUFJLElBQWMsQ0FBQztJQUNuQixJQUFJLE1BQTZCLENBQUM7SUFDbEMsSUFBSSxXQUFnQyxDQUFDO0lBQ3JDLElBQUksSUFBVSxDQUFDO0lBRWYsSUFBSSxZQUFvQyxDQUFDO0lBQ3pDLElBQUksaUJBQW9DLENBQUM7SUFDekMsSUFBSSxlQUFnQyxDQUFDO0lBQ3JDLElBQUksbUJBQXdDLENBQUM7SUFFN0MsSUFBSSxPQUFrQyxDQUFDO0lBRXZDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsTUFBTSxHQUFHLGlCQUFJLEVBQUUsQ0FBQztRQUNoQixXQUFXLEdBQUcsaUJBQUksRUFBRSxDQUFDO1FBQ3JCLElBQUksR0FBRyxpQkFBSSxFQUFFLENBQUM7UUFDZCxZQUFZLEdBQUcsaUJBQUksRUFBRSxDQUFDO1FBQ3RCLGlCQUFpQixHQUFHLGlCQUFJLEVBQUUsQ0FBQztRQUMzQixlQUFlLEdBQUcsaUJBQUksRUFBRSxDQUFDO1FBQ3pCLG1CQUFtQixHQUFHLGlCQUFJLEVBQUUsQ0FBQztRQUU3QixPQUFPLEdBQUcsSUFBSSxxREFBeUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3BKLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUNqQyxFQUFFLENBQUMsNkNBQTZDLEVBQUUs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