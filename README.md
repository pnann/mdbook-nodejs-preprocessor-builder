# mdbook-nodejs-preprocessor-builder
> A framework for building [mdBook](https://github.com/rust-lang/mdBook) preprocessors with NodeJS. Supports MdBook 0.3.x

`mdbook-nodejs-preprocessor-builder` enables you to easily build macros and dynamically generated content into mdBook projects. Easily build macros, text replacement, table generation, or even dynamic content from the flexibility and comfort of NodeJS.

## What, Why, and How
MdBook has the concept of a [Preprocessor](https://rust-lang.github.io/mdBook/for_developers/preprocessors.html), which can transform markdown after it's been read by MdBook but before it reaches the final Renderer. Preprocessors enable users to add advanced functionality without having to modify the MdBook source or rely solely on client-side JavaScript. At its simplest, a Preprocessor can replace any input text into any output text. For example, a username replacer preprocessor could replace all instances of `{{#username}}` with `Bob`.

As MdBook is written in Rust, Rust-based preprocessors are well supported with full interfaces and examples. One can relatively easy create a new preprocessor in Rust, but there are many other languages one might use with their own advantages and disadvantages. MdBook's preprocessor feature supports executing preprocessors in a separate process, leading to the ability to implement them in any way shape and form the user likes.

The `mdbook-nodejs-preproessor-builder`, as its name implies, is a framework for easily implementing said preprocessors using NodeJS. It abstracts away all the details of integrating with MdBook, message passing, and serializing/deserializing data. It also includes support for common macro patterns, enabling preprocessors to be easily implemented in TypeScript or JavaScript.

## Handler Types
This builder comes with out-of-the-box support for three distinct types of handlers: `Raw`, `RegExp`, and `KeyValue`. Each one includes a increasing level of built-in macro processing: `Raw` supplies the full content for generic processing by the handler, `RegExp` allows you to supply your own custom Regular Expression for macro matching, and `KeyValue` makes it easy to add structured macros with well-defined key-value attributes.

#### Ordering of handlers
Be aware that a preprocessor can contain any number of handlers, with any number of types. They are always executed as follows:
1. Raw handlers, in the order of assignment to the builder.
1. RegExp handlers, in the order of assignment to the builder.
1. KeyValue handlers, in the order of assignment to the builder.

This means that if you attach RawA, RegExpA, KeyValueA, KeyValueB, RegExpB, RawB, the order of execution will be RawA, RawB, RegExpA, RegExpB, KeyValueA, KeyValueB.

### Raw 
Raw handlers are the most generic type of handler -- each chapter is passed in blindly for processing, and each handler can modify the Chapter as it wishes. Unlike the other handlers, there is no parsing or processing of the content whatsoever. It is solely the responsibility of the handler.

Note: There is no need to modify `sub_items` in each Chapter -- the handler will be called for each and every Chapter, including sub_items.

```typescript
import {MdBookProcessorBuilder} from "mdbook-nodejs-preprocessor-builder";

MdBookPreprocessorBuilder.builder()
    .withRendererSupport("html")
    .withRawContentHandler((inputChapter: Chapter) => {
        chapter.content = chapter.content.replace("Kirk", "Picard");
        return chapter;
    })
    .ready();
```

### RegExp
RegExp handlers include integrated support for RegExp parsing and replacement of content, without the user needing to add their own boilerplate. Unlike raw handlers above, this requires the user to return the replacement string. The full `Chapter` is still included for reference, as well as if the Handler would like to modify it (not recommended). Do **not** modify `chapter.content`, as it will be overridden once all handlers have been evaluated.

In the following example, all instances of any string matching the RegExp of `{{RankMacro (\S*) (\S*)}}` will be matched and entirely replaced.

```typescript
import {MdBookProcessorBuilder} from "mdbook-nodejs-preprocessor-builder";

MdBookPreprocessorBuilder.builder()
    .withRendererSupport("html")
    .withRegExpHandler(/{{RankMacro (\S*) (\S*)}}/g, (inputChapter: Chapter, fullyMatchedString: string, firstName: string, lastName: string) => {
        // fullyMatchedString: "{{#RankMacro Jean-Luc Picard}}"
        if(firstName === "Jean-Luc" && lastName === "Picard") {
            return "Captain Jean-Luc Picard";
        }

        return `${firstName} ${lastName}`;
    })
    .ready();
```

### KeyValue
KeyValue handlers include integrated support for parsing macros in a common form: `{{#macroName key=value boolKey}}`. This is the easiest way to get started with your own macro.

#### Names
KeyValue handlers only need a name to get started. This name is used to find any and all macros with the format: ``{{#macroName}}``. So, if your name is `Ship`, the matched macro would be of the form `{{#Ship}}`. The handler will *only* be executed for strings matching that structure, regardless of whether or not there are any attributes given.

#### Attributes
Attributes are anything after the name of the macro (plus a space), and before the closing curly-braces. All attributes are expected to be in the format used by [node-logfmt](https://github.com/csquared/node-logfmt) -- these are very simple key-value pairs, with boolean values optionally requiring an explicit value. Strings may be wrapped in quotes, double quotes, or none at all if they don't contain whitespace. Numbers and boolean values are likewise parsed.

Attributes passed into handlers are directly parsed from the raw macro string. For full documentation of the schema, see [node-logfmt](https://github.com/csquared/node-logfmt).

For example, the following are equivalent:
* `{{#Ship name="Enterprise" registryNumber=1701 active=true}}`
* `{{#Ship name=Enterprise registryNumber=1701 active}}`

```typescript
import {MdBookProcessorBuilder} from "mdbook-nodejs-preprocessor-builder";

MdBookPreprocessorBuilder.builder()
    .withRendererSupport("html")
    .withKeyValueHandler("Ship", (inputChapter: Chapter, matches: { name: string; registryNumber: number, active: boolean }) => {
        // fullyMatchedString: "{{#Ship name="Enterprise" registryNumber=1701 active}}"
        // Replaces it with: "USS Enterprise, NCC-1701, currently active"
        return `USS ${matches.name}, NCC-${matches.registryNumber},  currently ${matches.active ? "active" : "inactive"}`;
    })
    .ready();
```

## Creating a Preprocessor

1. Create a new NodeJS package.
1. Install `mdbook-nodejs-preprocessor`
1. Create a TS or JS file that can be executed on the CLI. TypeScript definitions are included for your convenience.
1. Create an instance of `MdBookPreprocessorBuilder` and declare one or more `renderer` types. These should match those in your `book.toml` file.
1. Attach one or more content replacement handlers, either via `KeyValue`, `RawContent`, or `RegExp`.
1. Call `.ready()`, optionally waiting for the promise to resolve.

## Adding the Preprocessor
This is the easy part -- just add a toml table in the format of `[preprocessor.*]` and with `command` and `renderer` keys. The renderer types must match those declared in your preprocessor.

```toml
[preprocessor.example]
command = "node where/your/preprocessor-is.js"
renderer = ["html"] 
```