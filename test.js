const assert = require("assert");
const sql = require('./sql');

it('basic', () => {
  template = sql`test`;
  assert.deepEqual(template, {
    text: 'test',
    values: []
  })
});

it('integer', () => {
  template = sql`test ${1} test`;
  assert.deepEqual(template, {
    text: 'test $1 test',
    values: [1]
  })
});

it('null', () => {
  template = sql`test ${null} test`;
  assert.deepEqual(template, {
    text: 'test NULL test',
    values: []
  })
});

it('undefined -> exception', () => {
  let exception;

  try {
    template = sql`test ${undefined} test`;
    template.text
  } catch (e) {
    exception = e
  }

  assert.equal(exception?.message, "undefined argument $1 to query")
});

it('nested template', () => {
  template = sql`test ${1} ${sql`test ${2} test`} test`;
  assert.deepEqual(template, {
    text: 'test $1 test $2 test test',
    values: [1, 2]
  })
});

it('array', () => {
  const objs = [
    { key: 1, value: 'a' },
    { key: "2", value: 'b' },
  ]

  template = sql`insert into table (${ Object.keys(objs[0]).map(sql.id) }) values ${ objs.map(o => sql`(${Object.values(o)})`) }`;
  assert.deepEqual(template, {
    text: 'insert into table ("key","value") values ($1,$2),($3,$4)',
    values: [1, "a", "2", "b"]
  })
});

it('sql.raw', () => {
  template = sql`test ${sql.raw('RAW')} test`;
  assert.deepEqual(template, {
    text: 'test RAW test',
    values: []
  })
});

it('sql.id', () => {
  template = sql`test ${sql.id('"gigel')} test`;
  assert.deepEqual(template, {
    text: 'test """gigel" test',
    values: []
  })
});

it('sql.insertObjs', () => {
  const objs = [
    { key: 1, value: 'a' },
    { key: 2, value: 'b' },
  ]

  template = sql`insert into table ${sql.insertObjs(objs)}`;
  assert.deepEqual(template, {
    text: 'insert into table ("key","value") values ($1,$2),($3,$4)',
    values: [1, "a", 2, "b"]
  })
});

it('sql.setObj', () => {
  template = sql`update table set ${sql.setObj({
    status: 1,
    text: 'correct'
  })} `;

  assert.deepEqual(template, {
    text: 'update table set "status"=$1,"text"=$2',
    values: [1, 'correct']
  })
});