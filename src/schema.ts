import { Record, List } from "immutable";
import { Field } from "./field";
import { isIterable, warnOnce } from "./utils";

export interface Rule {
  match: (this: Schema, field: Field) => boolean;
  transform?: (this: Schema, value: any, field: Field) => any;
  normalize?: (this: Schema, field: Field) => Field;
  join?: (this: Schema, field: Field, joinWith: Field) => Field;
}

export interface SchemaRecord {
  rules: List<Rule>;
}

const DEFAULTS: SchemaRecord = {
  rules: List(),
};

export type SchemaCreateRules = Iterable<Rule>;

export interface SchemaCreateObject {
  rules?: SchemaCreateRules;
}

export type SchemaCreate = SchemaCreateRules | SchemaCreateObject;

export class Schema extends Record(DEFAULTS) {
  static create(props?: SchemaCreate) {
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

  static isSchema(b: any): b is Schema {
    return Boolean(b && b.kind === "schema");
  }

  get kind() {
    return "schema";
  }

  reduce(field: Field, fn: (this: Schema, rule: Rule, field: Field) => Field) {
    for (const rule of this.rules) {
      if (rule.match.call(this, field)) {
        field = fn.call(this, rule, field);
      }
    }

    return field;
  }

  apply(field: Field, prop: keyof Rule, ...args: any[]) {
    warnOnce(
      "apply() method on form-blueprint schema is deprecated." +
        " Use Schema#reduce() instead and run methods directly."
    );

    return this.reduce(field, (rule, f) => {
      const method = rule[prop];
      if (typeof method !== "function") return f;
      const res = (method as any).apply(this, [f, ...args]);
      return Field.isField(res) ? res : f;
    });
  }

  normalize(field: Field): Field {
    field = this.reduce(field, (rule, f) => {
      return rule.normalize ? rule.normalize.call(this, f) : f;
    });

    return field.merge({
      children: field.children.map((c) => this.normalize(c)),
    });
  }

  transform(value: any, field: Field) {
    this.reduce(field, (rule, f) => {
      if (rule.transform) {
        value = rule.transform.call(this, value, f);
      }

      return f;
    });

    return value;
  }

  join(field: Field, ...toJoin: Field[]) {
    for (const join of toJoin) {
      field = this.reduce(field, (rule, f) => {
        return rule.join ? rule.join.call(this, f, join) : f;
      });
    }

    return field;
  }

  addRule(rule: Rule) {
    return this.merge({
      rules: this.rules.push(resolveRule(rule)),
    });
  }

  concat(rules: SchemaCreate) {
    let newRules = this.rules;

    for (const rule of Schema.create(rules).rules) {
      if (!newRules.includes(rule)) newRules = newRules.push(rule);
    }

    return this.merge({
      rules: newRules,
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
