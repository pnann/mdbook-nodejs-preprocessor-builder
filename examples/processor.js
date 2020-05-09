"use strict";
exports.__esModule = true;
var MdBookPreprocessorBuilder_1 = require("../lib/src/MdBookPreprocessorBuilder");
/**
 * An example Raw Content Handler which takes a chapter in and replaces all instances of "Kirk" with "Picard".
 */
function rawContentKirkHandler(chapter) {
    chapter.content = chapter.content.replace(/Kirk/g, "Picard");
    return chapter;
}
/**
 * An example RegExp Handler which takes a chapter, the fully matched string, and all matches, and adds the rank for
 * Picard, if set. If not, pass through the name.
 */
function regExpRankHandler(chapter, fullMatchedString, firstName, lastName) {
    console.error(fullMatchedString);
    console.error("FirstName: " + firstName + " LastName: " + lastName);
    if (firstName === "Jean-Luc" && lastName === "Picard") {
        return "Captain Jean-Luc Picard";
    }
    return firstName + " " + lastName;
}
/**
 * An example KeyValue Handler which takes a chapter, and a pre-processed set of attributes extracted from the macro string.
 */
function keyValueShipHandler(inputChapter, matches) {
    return "USS " + matches.name + ", NCC-" + matches.registryNumber + ",  currently " + (matches.active ? "active" : "inactive");
}
MdBookPreprocessorBuilder_1.MdBookPreprocessorBuilder.builder()
    .withRendererSupport("html")
    .withRawContentHandler(rawContentKirkHandler)
    .withRegExpHandler(/{{RankMacro (\S*) (\S*)}}/g, regExpRankHandler) // Note, how RankMacro isn't prefixed with #
    .withKeyValueHandler("Ship", keyValueShipHandler)
    .ready()["catch"](function (error) {
    console.error(error);
});
