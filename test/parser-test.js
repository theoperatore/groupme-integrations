'use strict';

import Parser from '../ops/parser';
import destiny from '../destiny';
import pokeapi from '../pokeapi';


let parser = Parser(pokeapi, destiny, () => {
  return {
    test: args => args.join()
  }
});

parser('error').then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
});

parser('test here are some args').then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
});

parser('weapon').then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
})

parser('player abersoto').then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
})

parser('player theoperatore').then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
})

parser('pkmn pikachu').then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
})

parser('pkmn blargle').then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
})