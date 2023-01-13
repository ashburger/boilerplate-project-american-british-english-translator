const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')
const highlightSpanOpen = '<span class="highlight">';
const highlightSpanClose = '</span>';
class Translator {
    translate(sentence, locale){
        let sentenceWords = sentence.trim().split(/\b/g);
        let oneLangOnly, timeSeperator, translatedTimeSeperator, titleSeperator;
        // set translation dictionaries and seperators
        if(locale == 'american-to-british'){
            oneLangOnly = americanOnly;
            timeSeperator = ':';
            translatedTimeSeperator = '.';
            titleSeperator = '.';
        }else{
            oneLangOnly = britishOnly;
            timeSeperator = '.';
            translatedTimeSeperator = ':';
            titleSeperator = 'DoesntExist';
        }
        let i = 0;
        while(i<sentenceWords.length){
            switch(sentenceWords[i].charAt(0)){
                // if space character is detected, check for multiple word phrases
                case " ":
                    // check for three word phrases
                    if(sentenceWords[i+2] == " "){
                        let threeWords = sentenceWords.slice(i-1,i+4).join("").toLowerCase();
                        let translatedPhrase = oneLangOnly[threeWords];
                        if(translatedPhrase){
                            sentenceWords[i-1] = highlightSpanOpen + translatedPhrase + highlightSpanClose;
                            sentenceWords.splice(i, 4);
                            break;
                        }
                    }
                    // check for two word phrases
                    let twoWords = sentenceWords.slice(i-1,i+2).join("").toLowerCase();
                    let translatedPhrase = oneLangOnly[twoWords];
                    if(translatedPhrase){
                        sentenceWords[i-1] = highlightSpanOpen + translatedPhrase + highlightSpanClose;
                        sentenceWords.splice(i, 2);
                    }
                    break;
                // checks for ':' if american-to-british, '.' for british-to-american
                case timeSeperator:
                    // checks if the previous and next char from the current char (either ':' or '.') is a number
                    if(/[0-9]$/.test(sentenceWords[i-1]) && /^[0-9]/.test(sentenceWords[i+1])){
                        // get the position of the last number(s) (max 2) from the previous element to know where to start highlight span tag
                        let lastElement = sentenceWords[i-1];
                        let endingNumbersIndex = lastElement.lastIndexOf(lastElement.match(/[0-9]{1,2}$/)[0]);
                        let modifiedLastElement = lastElement.substring(0, endingNumbersIndex) + highlightSpanOpen 
                        + lastElement.substring(endingNumbersIndex);

                        // get the length of the first number(s) (max 2) to know where to place ending span tag
                        let startingNumbersLength = sentenceWords[i+1].match(/^[0-9]{1,2}/)[0].length;
                        let modifiedNextElement = sentenceWords[i+1].substring(0, startingNumbersLength) + highlightSpanClose
                         + sentenceWords[i+1].substring(startingNumbersLength);

                        sentenceWords[i-1] = modifiedLastElement + translatedTimeSeperator + modifiedNextElement;
                        sentenceWords.splice(i, 2);
                    }
                    break;
                // checks for '.' for titles, only if american-to-british is selected
                case titleSeperator:
                    let title = americanToBritishTitles[sentenceWords[i-1].toLowerCase() + '.'];
                    if(title){
                        sentenceWords[i-1] = highlightSpanOpen + title.charAt(0).toUpperCase() + title.substring(1) + highlightSpanClose;
                        sentenceWords[i] = sentenceWords[i].substring(1); // ensures special chars after '.' are kept, if any exist
                    }
                    break;
                default:
                    // if british to american is selected, tries to translate it as a title
                    if(locale == 'british-to-american'){
                        let title = Object.keys(americanToBritishTitles).find(key => americanToBritishTitles[key] === sentenceWords[i].toLowerCase());
                        if(title){
                            sentenceWords[i] = highlightSpanOpen + title.charAt(0).toUpperCase() + title.substring(1) + highlightSpanClose;
                            break;
                        }
                    }
                    // tries to translate spelling
                    let translatedSpelling = this.spellingTranslator(sentenceWords[i].toLowerCase(), locale);
                    if(translatedSpelling){
                        sentenceWords[i] = highlightSpanOpen + translatedSpelling + highlightSpanClose;
                        break;
                    }
                    // tries to translate single word
                    let translatedWord = oneLangOnly[sentenceWords[i].toLowerCase()];
                    if(translatedWord){
                        sentenceWords[i] = highlightSpanOpen + translatedWord + highlightSpanClose;
                    }
                    break;
            }
            i++;
        }
        
        let translation = sentenceWords.join("");
        return translation.substring(0, 1).toUpperCase() + translation.substring(1);
    }

    spellingTranslator(phrase, locale){
        if(locale=='american-to-british'){
            return americanToBritishSpelling[phrase];
        }
        else{
            return Object.keys(americanToBritishSpelling).find(key => americanToBritishSpelling[key] === phrase);
        }
    }


}

module.exports = Translator;