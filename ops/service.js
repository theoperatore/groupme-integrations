'use strict';

import { Promise } from 'es6-promise';
import destiny from '../destiny';
import pokeapi from '../pokeapi';
import groupme from '../groupme';
import Parser from './parser';


function bot() {

  // these should be mix-in functions
  let parser = Parser(destiny, pokeapi);

  return function(rawText) {
    parser(rawText).then(data => {

      // post to groupme: data is an array of {text, img} objects
      data.reduce((seq, item) => {
        
        return seq.then(() => {
          return groupme(item.text).then(() => {
            if (item.img) {
              return groupme(item.img);
            }
          })
        })

      }, Promise.resolve()).then(() => {
        console.log('payload sent to groupme');
      })

    }).catch(err => {

      // sending anything causes this entire thing to happen again.
      //console.log('[service] caught error:', err);
      //groupme(err.message);

      // handle error
      // each error should be custom
      // type: UNRECOGNIZED_COMMAND, *_REQUEST_ERROR, etc...
      // message: possible message to post to groupme
      // err: error object

    });
  }
}

export { bot as BotService };