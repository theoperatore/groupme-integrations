'use strict';

export function find(pokedex, name) {
  for (var i = 0; i < pokedex.length; i++) {
    if (pokedex[i].name.toLowerCase() === name.toLowerCase()) {
      return pokedex[i];
    }
  }
}