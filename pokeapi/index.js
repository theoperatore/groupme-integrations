'use strict';

import { Promise } from 'es6-promise';
import * as util from './util';
import endpoints from './endpoints';
import { getPokemonResource } from '../ops/gateway';

// the cached pokedex
let pokedex;


// actually find the pokemon and format for printing
function findPokemon(args) {
  let pkmn = util.find(pokedex, args[0]);
  if (pkmn) {
    let pkmn_url = endpoints.pokemon.replace('%s', pkmn.resource_uri);
    return getPokemonResource(pkmn_url).then(pkmnBody => {
      
      let pkmnData = {
        name: pkmnBody.name,
        type: pkmnBody.types.reduce((out, type) => `${out}${type.name} `, '').trim().replace(' ', ' / ')
      }

      return {pkmnData, pkmnBody};
    }).then(data => {
      let desc_url = endpoints.description.replace('%s', data.pkmnBody.descriptions[0].resource_uri);
      return getPokemonResource(desc_url).then(descData => {
        data.pkmnData.desc = descData.description;
        return data;
      })
    }).then(data => {
      let sprite_url = endpoints.sprite.replace('%s', data.pkmnBody.sprites[0].resource_uri);
      return getPokemonResource(sprite_url).then(spriteData => {
        data.pkmnData.img = endpoints.img.replace('%s', spriteData.image);

        return data.pkmnData
      })
    }).then(p => {
      return [{
        text: `${p.name}: A [ ${p.type} ] pokemon. ${p.desc}`,
        img: p.img
      }]
    })
  }

  return Promise.reject({type: 'NOT_FOUND', message: `Error: pokemon [${args[0]}] not found`});
}


// cache the pokedex only in local memory
function getPokedex() {
  return getPokemonResource(endpoints.pokedex).then(body => {
    pokedex = body.pokemon;
  })
}


// first grab the pokedex if not requested yet
// otherwise just find the pokemon
function handlePokemon(args) {
  if (!pokedex) {
    return getPokedex().then(() => findPokemon(args));
  }

  return findPokemon(args);
}


// export commands to interact with the pokeapi
export default function mixin() {
  return {
    pkmn: handlePokemon
  }
}
