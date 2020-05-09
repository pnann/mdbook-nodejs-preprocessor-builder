/**
 * The JSON interface used by MdBook for passing in context into Preprocessors. This is INCOMPLETE!
 *
 * Directly ported from: https://github.com/rust-lang/mdBook/blob/8542f7f29d2f84f2c1dc91d17c87501563b56879/src/preprocess/mod.rs#L20
 */
interface PreprocessorContext {
    root: string;
    config: {
        book: {
            title: string;
            authors: string[];
            description?: string;
            src: string;
            multilingual: boolean;
            language?: string;
        };
    };
    renderer: string;
    mdbook_version: string;
}
/**
 * A common interface used by Book sections. As of 0.3.x, the only type of BookItem is a Chapter.
 */
interface BookItem {
    Chapter: Chapter;
}
/**
 * The JSON interface used by MdBook to describe a Chapter.
 */
interface Chapter {
    name: string;
    content: string;
    number: number[];
    sub_items: BookItem[];
    path: string;
    parent_names: string[];
}
/**
 * The JSON interface used by MDBook for passing in the actual book contents into Preprocessors.
 *
 * Directly ported from: https://github.com/rust-lang/mdBook/blob/8542f7f29d2f84f2c1dc91d17c87501563b56879/src/book/book.rs#L72
 */
interface Book {
    sections: BookItem[];
}
/**
 * The actual top-level JSON type used by MDBook.
 */
declare type PreprocessorInput = [PreprocessorContext, Book];
export { PreprocessorInput, PreprocessorContext, Book, BookItem, Chapter };
