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

it('sql raw', () => {
  template = sql`test ${sql('RAW')} test`;
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

it('sql.join', () => {
  template = sql`${sql.join([1, sql`hello`, 2, 3], "-")}`;
  assert.deepEqual(template, {
    text: '$1-hello-$2-$3',
    values: [1, 2, 3]
  })
});
