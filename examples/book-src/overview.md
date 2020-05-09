# Top-level Chapter

## Raw Example
This is an example of processing with raw chapters. In this case, we're going to replace all instances of Kirk with Picard. So, if the preprocessor worked, you should see the Kirk Kirk Kirk be Picard Picard Picard.

## RegExp Example
This is an example of processing with a RegExp handler. In this case, we're going to insert Picard's rank, but no one else's.

The Commanding Officer of the USS Enterprise is {{RankMacro Jean-Luc Picard}}. His First Officer is {{RankMacro Will Riker}}. If the processor worked, you should see Picard's rank, but not Riker's.

## KeyValue Example
This is an example of processing with a KeyValue handler. In this case, we're going to generate Ship identifiers based on attributes.

The following is a list of active or inactive Federation Starships. if the processor worked, you should see the Enterprise, the Defiant, and Voyager. See the flexibility in the attribute parsing supplied by [node-logfmt](https://github.com/csquared/node-logfmt).
 * {{#Ship name=Enterprise registryNumber=1701}}
 * {{#Ship name=Defiant registryNumber=75633 active}}
 * {{#Ship name="Voyager" registryNumber=74656 active=false}}
 

