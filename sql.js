'use strict';

let minify;

try {
  minify = require('pg-minify');
} catch (e) {
  minify = a => a
}

const $sql = Symbol();

function sql(strings, ...values) {
  let compiled = null;
  strings = strings || ['']
  strings = Array.isArray(strings) ? strings : [strings]

  const template = {
    s: strings,
    v: values || []
  }

  function getQuery() {
    let d = 1;
    return compiled || (compiled = compile(template));

    function compile(i) {
      const o = { s: '', v: [] };
      let c;

      for (c = 0; c < i.v.length; c++) {
        const v = i.v[c];
        o.s += i.s[c] || '';

        if (v === undefined) {
          throw new Error(`undefined argument $${d} to query`, { template: template });
        } else if (v === null) {
          o.s += 'NULL'
        } else if (typeof v === 'object' && v[$sql]) {
          const w = compile(v[$sql]);
          o.s += w.s;
          o.v = o.v.concat(w.v);
        } else {
          o.s += `$${d++}`;
          o.v.push(v);
        }
      }

      o.s += i.s[c] || '';
      o.s = minify(o.s);
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

sql.id = function (s) {
  return sql([`"${s.replace(/"/g, '""')}"`]);
}

sql.join = function (v, d = ', ') {
  return sql(Array(v.length + 1).fill('').fill(d, 1, v.length), ...v);
}

module.exports = sql;
