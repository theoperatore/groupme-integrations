'use strict';

export function findExoticSaleItems(saleItemCategories) {
  return saleItemCategories.filter(cat => cat.categoryTitle === 'Exotic Gear')[0].saleItems;
}

export function parseMinutes(rawMins) {
  let totalMins = Number(rawMins);
  
  let days = totalMins / (24 * 60) | 0;
  let hours = totalMins % (24 * 60) / 60 | 0;
  let mins = totalMins % 60 | 0;

  return { days, hours, mins };
}

export function assign(target, ...srcs) {
  return srcs.reduce((trg, src) => {
    Object.getOwnPropertyNames(src).forEach(prop => {
      if (!trg.hasOwnProperty(prop)) {
        trg[prop] = src[prop];
      }
    })

    return trg;
  }, target);
}