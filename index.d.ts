type TemplateValue = unknown | SqlQuery;

type SqlQuery = {
  readonly text: string,
  readonly values: Array<unknown>
};

declare function sql(strings: TemplateStringsArray | string, ...v: TemplateValue[]): SqlQuery;
declare namespace sql {
  function id(s: string): SqlQuery;
  function join(s: TemplateValue[], separator?: string): SqlQuery;
}

export = sql;
