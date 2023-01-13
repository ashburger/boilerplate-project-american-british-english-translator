const chai = require('chai');
const assert = chai.assert;
const americanToBritishPhrases = require('./test_phrases').americanToBritishPhrases;
const britishToAmericanPhrases = require('./test_phrases').britishToAmericanPhrases;
const Translator = require('../components/translator.js');
let translator = new Translator();
suite('Unit Tests', () => {

    suite('American to British tests', () => {
        for(let phrase of americanToBritishPhrases){
            test(`Translate ${phrase[0]} to British English`, (done)=>{
                assert.equal(translator.translate(phrase[0], 'american-to-british'), phrase[1]);
                done();
            });
        }
    });

    suite('British to American tests', () => {
        for(let phrase of britishToAmericanPhrases){
            test(`Translate ${phrase[0]} to American English`, (done)=>{
                assert.equal(translator.translate(phrase[0], 'british-to-american'), phrase[1]);
                done();
            });
        }
    });

    suite('Highlight tests', ()=>{
        test('Highlight translation in Mangoes are my favorite fruit.', (done) => {
            assert.equal(translator.translate('Mangoes are my favorite fruit.', 'american-to-british'), 'Mangoes are my <span class="highlight">favourite</span> fruit.');
            done();
        });

        test('Highlight translation in I ate yogurt for breakfast.', (done) => {
            assert.equal(translator.translate('I ate yogurt for breakfast.', 'american-to-british'), 'I ate <span class="highlight">yoghurt</span> for breakfast.');
            done();
        });

        test('Highlight translation in We watched the footie match for a while.', (done) => {
            assert.equal(translator.translate('We watched the footie match for a while.', 'british-to-american'), 'We watched the <span class="highlight">soccer</span> match for a while.');
            done();
        });

        test('Highlight translation in Paracetamol takes up to an hour to work.', (done) => {
            assert.equal(translator.translate('Paracetamol takes up to an hour to work.', 'british-to-american'), '<span class="highlight">Tylenol</span> takes up to an hour to work.');
            done();
        });
    })

});
