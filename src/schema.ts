import { List, Record } from "immutable";
import { Field, FieldCreate } from "./field";
import { isIterable, isNullOrEqual } from "./utils";

export interface Rule {
  match: (this: Schema, field: Field) => boolean;
  transform?: (this: Schema, field: Field, value: any) => any;
  normalize?: (this: Schema, field: Field) => FieldCreate;
  join?: (this: Schema, field: Field, merge: Field) => FieldCreate | void;
  serialize?: (this: Schema, field: Field) => FieldCreate;
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

  static defaultJoin(schema: Schema, field: Field, mergeIn: Field) {
    // must match type
    if (!isNullOrEqual(field.type, mergeIn.type)) {
      return mergeIn;
    }

    return field.merge({
      type: mergeIn.type ?? field.type,
      props: field.props.merge(mergeIn.props),
      children: Field.mergeChildren(schema.join.bind(schema), field.children, mergeIn.children),
    });
  }

  static isSchema(b: any): b is Schema {
    return b != null && b.__form_blueprint_schema__ === true;
  }

  private get __form_blueprint_schema__() {
    return true;
  }

  get kind() {
    return "schema";
  }

  reduce<T>(fn: (memo: T, rule: Rule) => T, initial: T): T;
  reduce<T>(fn: (memo: T | undefined, rule: Rule) => T | undefined, initial?: T): T | undefined;
  reduce<T>(fn: (memo: T | undefined, rule: Rule) => T | undefined, initial?: T) {
    return this.rules.reduce((memo, rule) => fn(memo, rule), initial);
  }

  normalize(field: Field): Field {
    return this.reduce((memo, rule) => {
      if (rule.normalize && rule.match.call(this, memo)) {
        return Field.create(rule.normalize.call(this, memo));
      } else {
        return memo;
      }
    }, field);
  }

  serialize(field?: FieldCreate) {
    const $field = Field.create(field);

    return this.reduce((memo, rule) => {
      if (rule.serialize && rule.match.call(this, memo)) {
        return Field.create(rule.serialize.call(this, memo));
      } else {
        return memo;
      }
    }, $field);
  }

  transform(field: Field, value?: any) {
    return this.reduce((memo, rule) => {
      if (rule.transform && rule.match.call(this, field)) {
        return rule.transform.call(this, field, memo);
      } else {
        return memo;
      }
    }, value);
  }

  join(root: Field, ...mergeIn: Field[]) {
    let result = root;

    for (const field of mergeIn) {
      // keys must match or be null
      if (!isNullOrEqual(result.key, field.key)) {
        result = field;
        continue;
      }

      // remember the key
      const key = field.key ?? result.key;

      // first rule join to return a field is used and rest of rules are ignored
      const joined = this.reduce<FieldCreate>((memo, rule) => {
        if (memo == null && rule.join && rule.match.call(this, result) && rule.match.call(this, field)) {
          return rule.join.call(this, result, field) || undefined;
        } else {
          return memo;
        }
      });

      // set result or use the default joiner
      result = joined != null ? Field.create(joined) : Schema.defaultJoin(this, result, field);

      // ensure the correct key is set
      if (result.key !== key) result = result.merge({ key });
    }

    return this.normalize(result);
  }

  addRule(rule: Rule) {
    return this.merge({
      rules: this.rules.push(resolveRule(rule)),
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
