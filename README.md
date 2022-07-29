# pgtemplate

minimal sql template for pg module



usage:
```
pg = require("pg")
SQL = require("pgtemplate")

...

pg.query(SQL`delete from poll_options where id in (${deleteOptions.map(v => v.id)}) returning *`)

```