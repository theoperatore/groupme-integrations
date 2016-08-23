'use strict';

import pokeapiMixin from '../pokeapi';

let pokeapi = pokeapiMixin();

pokeapi.pkmn(['abra']).then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
})

pokeapi.pkmn(['blarg']).then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
})

pokeapi.pkmn(['pikachu']).then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
})