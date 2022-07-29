'use strict';
const minify = require('pg-minify');

const $raw = Symbol();
const $sql = Symbol();

function SQL(strings, ...values) {
  let compiled = null;
  const template = {
    s: strings || [''],
    v: values || []
  }

  function getQuery() {
    let d = 1;
    return compiled || (compiled = compile(template));

    function compile(i) {
      const o = { s: '', v: [] };

      for (let c = 0; c < i.v.length; c++) {
        const v = i.v[c];
        o.s += i.s[c] || '';

        if (v === undefined) {
          throw new Error(`undefined argument $${d} to query`, { template: template });
        } else if (v === null) {
          o.s += 'NULL'        
        } else if (typeof v === 'object' && v[$raw]) {
          o.s += v;
        } else if (typeof v === 'object' && v[$sql]) {
          const w = compile(v[$sql]);
          o.s += w.s;
          o.v = o.v.concat(w.v);
        } else {
          o.s += `$${d++}`;
          o.v.push(v);
        }
      }

      o.s += i.s[c] || ''; o.s = minify(o.s);
      return o;
    }
  }

  return {
    [$sql]: template,
    get text() {
      return getQuery().s;
    },
    get values() {
      return getQuery().v;
    }
  };
}

SQL.raw = function (s) {
  const v = new String(s);
  v[$raw] = true;
  return v;
}

SQL.id = function (s) {
  return SQL.raw(`"${s.replace(/"/g, '""')}"`);
}

SQL.joinVals = function(v, d = ', ') {
  return SQL(Array(v.length + 1).fill('').fill(d, 1, v.length), ...v);
}

SQL.joinIds = function (v, d = ', ') {
  return SQL(v.map(x => SQL.id(x)).join(d), []);
}

SQL.joinIV = function(v, d1 = ', ', d2 = ' = ') {
  return SQL(
    Object.keys(v).reduce(((r, v, k) => r.concat((k ? d1 : '') + SQL.id(v) + d2)), []), 
    ...Object.values(v)
  );
}

module.exports = SQL;