'use strict';

import { Promise } from 'es6-promise';
import { assign } from './util';

export default function parser(...mixins) {

  let commands = mixins.reduce((commands, mixin) => {
    return assign(commands, mixin());
  }, {})

  return function (rawText) {
    let parts = rawText.trim().split(' ');
    let rawCommand = parts[0];
    let command = rawCommand.split('#')[1]
    let args = parts.slice(1);

    if (command in commands && typeof commands[command] === 'function') {
      return Promise.resolve().then(() => commands[command].call(null, args));
    }
    else {
      return Promise.reject({
        type: 'UNRECOGNIZED_COMMAND',
        message: `[${rawCommand}] is not a valid command`,
        err: ''
      })
    }
  }
}
