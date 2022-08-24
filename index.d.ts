type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];
type JsonValue = JsonPrimitive | JsonArray | JsonObject;

type TemplateValue = JsonValue | SqlQuery | TemplateValue[];

type SqlQuery = {
  readonly text: string,
  readonly values: JsonArray[]
};

declare function sql(strings: TemplateStringsArray, ...v: TemplateValue[]): SqlQuery;
declare namespace sql {
  function raw(s: string): string;
  function id(s: string): string;
  function insertObjs(s: JsonObject[]): SqlQuery;
  function updateObj(s: JsonObject): SqlQuery;
}

export = sql;
