import { Record, List } from "immutable";
import { Field } from "./field";
import { isIterable } from "./utils";

export interface Rule {
  match: (this: Schema, field: Field) => any;
  transform?: (this: Schema, value: any, field: Field) => any;
  normalize?: (this: Schema, field: Field) => any;
  join?: (this: Schema, field: Field, joinWith: Field) => any;
}

export interface SchemaRecord {
  rules: List<Rule>;
}

const DEFAULTS: SchemaRecord = {
  rules: List()
};

export type SchemaCreateRules = Iterable<Rule>;

export interface SchemaCreateObject {
  rules?: SchemaCreateRules;
}

export type SchemaCreate = SchemaCreateRules | SchemaCreateObject;

export class Schema extends Record(DEFAULTS) {
  public static create(props?: SchemaCreate) {
    if (Schema.isSchema(props)) return props;

    let rules: Iterable<Rule>;

    if (isIterable(props)) {
      rules = props;
    } else if (props && isIterable(props.rules)) {
      rules = props.rules;
    } else {
      rules = [];
    }

    let ruleList: List<Rule> = List();
    for (const rule of rules) {
      ruleList = ruleList.push(resolveRule(rule));
    }

    return new Schema({ rules: ruleList });
  }

  public static isSchema(b: any): b is Schema {
    return Boolean(b && b.kind === "schema");
  }

  private get kind() {
    return "schema";
  }

  public apply(field: Field, prop: keyof Rule, ...args: any[]) {
    return this.rules.reduce((fieldResult, rule) => {
      const method = rule[prop];
      if (typeof method !== "function") return fieldResult;
      if (!rule.match.call(this, fieldResult)) return fieldResult;
      const res = method.apply(this, [fieldResult].concat(args));
      return Field.isField(res) ? res : fieldResult;
    }, field);
  }

  public normalize(field: Field): Field {
    field = this.apply(field, "normalize");
    return field.merge({
      children: field.children.map((c) => this.normalize(c))
    });
  }

  public transform(value: any, field: Field) {
    return this.rules.reduce((val, rule) => {
      if (!rule.transform) return val;
      if (!rule.match.call(this, field)) return val;
      return rule.transform.call(this, val, field);
    }, value);
  }

  public join(field: Field, ...toJoin: Field[]) {
    return toJoin.reduce((m, b) => this.apply(m, "join", b), field);
  }

  public addRule(rule: Rule) {
    return this.merge({
      rules: this.rules.push(resolveRule(rule))
    });
  }

  public concat(rules: SchemaCreate) {
    const schema = Schema.create(rules);

    return this.merge({
      rules: this.rules.concat(schema.rules)
    });
  }
}

function resolveRule(r?: Rule) {
  if (r == null || typeof r.match !== "function") {
    throw new Error("Rule is missing a match method");
  }

  if (r.transform && typeof r.transform !== "function") {
    throw new Error("Rule has an invalid transform method");
  }

  return r;
}
