'use strict';

import { Promise } from 'es6-promise';
import request from 'request';
import config from '../config';


export function getDestinyResource(url) {
  return new Promise((resolve, reject) => {
    let opts = {
      url: url,
      headers: {
        'X-Api-Key': config.DESTINY_API_KEY
      }
    }

    request(opts, (err, response, body) => {
      if (!err) {
        resolve(JSON.parse(body));
      }
      else {
        reject(err);
      }
    });
  })
}


export function getPokemonResource(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (!err) {
        resolve(JSON.parse(body));
      }
      else {
        reject(err);
      }
    })
  })
}
