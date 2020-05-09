import {MdBookPreprocessorBuilder} from "../lib/src/MdBookPreprocessorBuilder";
import {Chapter} from "../lib/src/PreprocessorInput"; // in production, use "mdbook-nodejs-preprocessor-builder"

/**
 * An example Raw Content Handler which takes a chapter in and replaces all instances of "Kirk" with "Picard".
 */
function rawContentKirkHandler(chapter: Chapter): Chapter {
    chapter.content = chapter.content.replace(/Kirk/g, "Picard");
    return chapter;
}

/**
 * An example RegExp Handler which takes a chapter, the fully matched string, and all matches, and adds the rank for
 * Picard, if set. If not, pass through the name.
 */
function regExpRankHandler(chapter: Chapter, fullMatchedString: string, firstName: string, lastName: string): string {
    if (firstName === "Jean-Luc" && lastName === "Picard") {
        return "Captain Jean-Luc Picard";
    }

    return `${firstName} ${lastName}`;
}

/**
 * An example KeyValue Handler which takes a chapter, and a pre-processed set of attributes extracted from the macro string.
 */
function keyValueShipHandler(inputChapter: Chapter, matches: { name: string; registryNumber: number, active: boolean }) {
    return `USS ${matches.name}, NCC-${matches.registryNumber},  currently ${matches.active ? "active" : "inactive"}`;
}

MdBookPreprocessorBuilder.builder()
    .withRendererSupport("html")
    .withRawContentHandler(rawContentKirkHandler)
    .withRegExpHandler(/{{RankMacro (\S*) (\S*)}}/g, regExpRankHandler) // Note, how RankMacro isn't prefixed with #
    .withKeyValueHandler("Ship", keyValueShipHandler)
    .ready()
    .catch((error) => {
        console.error(error);
    });