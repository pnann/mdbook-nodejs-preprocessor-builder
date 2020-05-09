/**
 * The JSON interface used by MdBook for passing in context into Preprocessors. This is INCOMPLETE!
 *
 * Directly ported from: https://github.com/rust-lang/mdBook/blob/8542f7f29d2f84f2c1dc91d17c87501563b56879/src/preprocess/mod.rs#L20
 */
interface PreprocessorContext {

    // The book's root directory.
    root: string;

    /*
     * The MDBook config from `config.toml`, meaning this is INCOMPLETE and may contain additional fields as defined
     * by the end-user.
     *
     * From: https://github.com/rust-lang/mdBook/blob/49b7f08164012f5840a0ec571d341eabf9276fc3/src/config.rs#L70
     */
    config: {
        book: {
            title: string;
            authors: string[];
            description?: string;

            // Location of the book source relative to the book's root directory
            src: string;
            multilingual: boolean,
            language?: string;
        }
    },

    // The renderer being used with this Preprocessor.
    renderer: string,

    // The version of MDBook executing this Preprocessor.
    mdbook_version: string
}

/**
 * A common interface used by Book sections. As of 0.3.x, the only type of BookItem is a Chapter.
 */
interface BookItem {
    Chapter: Chapter
}

/**
 * The JSON interface used by MdBook to describe a Chapter.
 */
interface Chapter {

    // The name of the Chapter.
    name: string;

    // The raw contents of the Chapter.
    content: string;

    // The chapter's section number, described as an array of numbers. For instance 1.2.3 would be [1, 2, 3]
    number: number[];

    // The set of nested sections for this Chapter.
    sub_items: BookItem[];

    // The location of the underlying file, relative to SUMMARY.md
    path: string;

    // An ordered list of the names of each parent chapter, from furthest to closest. This maps to the section numbers above.
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
type PreprocessorInput = [PreprocessorContext, Book];

export {PreprocessorInput, PreprocessorContext, Book, BookItem, Chapter};
