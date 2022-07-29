'use strict';

let minify;

try {
  minify = require('pg-minify');
} catch (e) {
  minify = a => a
}

const $raw = Symbol();
const $sql = Symbol();

function sql(strings, ...values) {
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
      let c;

      for (c = 0; c < i.v.length; c++) {
        const v = i.v[c];
        o.s += i.s[c] || '';

        if (v === undefined) {
          throw new Error(`undefined argument $${d} to query`, { template: template });
        } else if (v === null) {
          o.s += 'NULL'
        } else if (Array.isArray(v)) {
          const w = compile({ s: Array(v.length + 1).fill(',', 1, v.length), v })
          o.s += w.s;
          o.v = o.v.concat(w.v);
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

sql.raw = function (s) {
  const v = new String(s);
  v[$raw] = true;
  return v;
}

sql.id = function (s) {
  return sql.raw(`"${s.replace(/"/g, '""')}"`);
}

sql.insertObjs = function (v) {
  return sql`(${Object.keys(v[0]).map(sql.id)}) values ${v.map(o => sql`(${Object.values(o)})`)}`;
}

sql.setObj = function (v) {
  return sql`${Object.entries(v).map(([k, v]) => sql`${sql.id(k)}=${v}`)}`;
}

module.exports = sql;
