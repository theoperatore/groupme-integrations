'ust strict';

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