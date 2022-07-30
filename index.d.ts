type Value = number | string | null | SqlTemplate;

type SqlTemplate = {
  readonly text: string,
  readonly values: Array<Value>
};

declare function sql(strings: TemplateStringsArray, ...v: Value[]): SqlTemplate;
declare namespace sql {
  function raw(s: string): string;
  function id(s: string): string;
  function insertObjs(s: object[]): SqlTemplate;
  function updateObj(s: object): SqlTemplate;
}

export = sql;
