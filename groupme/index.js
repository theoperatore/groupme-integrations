'use strict';

import { Promise } from 'es6-promise';
import request from 'request';
import groupme from '../groupme';
import config from '../config';

let url = 'https://api.groupme.com/v3/bots/post';
let body = {
  text: '',
  bot_id: config.BOT_ID
}

export default function message(text) {
  return new Promise((resolve, reject) => {
    body.text = text;
    request.post({ url: url, formData: body }, (err, response, body) => {
      if (!err) {
        resolve(body);
        return;
      }

      reject(err);
    });
  })
}

// can also export a way to configure the server to start and stop
// listening for events