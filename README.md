# sqltemplate

micro sql template libray for `pg` and `mysql` modules

* <100 lines of code, zero dependencies [^1]
* typescript friendly

## usage
```js
const sql = require("@geogeim/sqltemplate");
const { Client } = require('pg')

...

const res = await client.query(sql`delete from options where id in (${sql.join(obsoleteOptions)}) returning *`);
```

The template recognizes the following argument types:

* undefined will throw an exception
* null values will output `NULL` string inside the text of the query
```js
sql`${null}` == { text: 'NULL', values: []}
```
* strings wrapped with `sql.raw()` will be directly inserted into the query
```js
sql`${sql('--\n')}` == { text: '--\n', values: []}
```
* strings wrapped with `sql.id()` are wrapped in double quotes and properly escaped
```js
sql`${sql.id('long row name"')}` == { text: '"long row name """', values: []}
```
* a nested template will be evaluated recursively
```js
sql`select * from "table" where id=${1} and ${sql`status=${2}`}` == 
  { text: 'select * from "table" where "id"=$1 and "status"=$2', values: [1, 2]}
``` 
* use `sql.join()` to join array of values or templates into a new template 
```js
sql.join([1, sql`hello`, 2], ",") == 
  { text: '$1,hello,$2', values: [1, 2]}
``` 

## tips
[^1]: you can also install `pg-minify` to make the outputted queries a bit nicer, no other config needed!
