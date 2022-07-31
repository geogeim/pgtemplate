type PlainValue = number | string | null;
type TemplateValue = PlainValue | SqlQuery | TemplateValue[]

type PlainObject = {
  [i: string]: PlainValue
};

type SqlQuery = {
  readonly text: string,
  readonly values: PlainValue[]
};

declare function sql(strings: TemplateStringsArray, ...v: TemplateValue[]): SqlQuery;
declare namespace sql {
  function raw(s: string): string;
  function id(s: string): string;
  function insertObjs(s: PlainObject[]): SqlQuery;
  function updateObj(s: PlainObject): SqlQuery;
}

export = sql;
