# sqltemplate

Minimal sql template libray for `pg` and `mysql` modules

<100 lines of code, zero dependencies*

##### * you can also install `pg-minify` to make the outputted queries a bit nicer, no other config needed!


## usage:
```js
pg = require("pg")
sql = require("sqltemplate")

...

pg.query(sql`delete from options where id in (${obsoleteOptions}) returning *`)

```

The template recognizes the following argument types:

* undefined will throw an exception
* null values will output `NULL` string inside the text of the query
```js
sql`${null}` == { text: 'NULL', values: []}
```
* strings wrapped with `sql.raw()` will be directly inserted into the query
```js
sql`${sql.raw('--\n')}` == { text: '--\n', values: []}
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
* an array will be evaluated itemwise and joined by comma
```js
sql`delete from poll_options where id in (${[1,2,3]}) returning *` == 
  { text: 'delete from poll_options where id in ($1,$2,$3) returning *', values: [1, 2, 3]}
```

## 2 extra helper methods are provided

* `sql.insertObjs(array)`: generates the column name and value arrays for an insert query. We assume that the objects are uniform (same keys in every object) and the array contains at least one object

```js
sql`insert into "table" ${sql.insertObjs([{key: 1, data: 1}, {key: 2, data: 2}])}` == 
  { text: 'insert into "table" ("key","value") values ($1,$2),($3,$4)', values: [1, 2, 3, 4]}
```
* `sql.updateObj(obj)`: generates the key=value pairs for an update query.

```js
sql`update "table" set ${sql.updateObj({key: 1, data: 1})}` == 
  { text: 'update "table" set "key"=$1,"value"=$2', values: [1, 2]}
```
