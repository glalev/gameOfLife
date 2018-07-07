// TODO implement map, filter, reduce, etc. so the same may be used as normal functions

const compose = (...fns) => {
  if (fns.length === 1) return fns;

  return (...params) => fns.reduceRight((acc, fn, i) => i ? [fn(...acc)] : fn(...acc), params);
}

const flat = (arr) => arr.reduce((flatten, el) => flatten.concat(...el), []);


module.exports = {compose, flat};