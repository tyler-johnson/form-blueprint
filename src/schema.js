import { Record, List } from "immutable";
import Field from "./field";

const DEFAULTS = {
  rules: null
};

export default class Schema extends Record(DEFAULTS) {
  static create(props = {}) {
    if (Schema.isSchema(props)) return props;
    if (Array.isArray(props)) props = { rules: props };
    props.rules = List(props.rules && props.rules.map(resolveRule));
    return new Schema(props);
  }

  static isSchema(b) {
    return b instanceof Schema;
  }

  get kind() {
    return "schema";
  }

  apply(field, prop, ...args) {
    return this.rules.reduce((b, rule) => {
      if (typeof rule[prop] !== "function") return b;
      if (!rule.match.call(this, b)) return b;
      const res = rule[prop].apply(this, [b].concat(args));
      return Field.isField(res) ? res : b;
    }, field);
  }

  normalize(field) {
    field = this.apply(field, "normalize");
    const children = field.children.map(c => this.normalize(c));
    return field.merge({ children });
  }

  transform(value, field) {
    return this.rules.reduce((val, rule) => {
      if (!rule.transform) return val;
      if (!rule.match.call(this, field)) return val;
      return rule.transform.call(this, val, field);
    }, value);
  }

  join(field, ...toJoin) {
    return toJoin.reduce((m, b) => this.apply(m, "join", b), field);
  }

  addRule(rule) {
    const rules = this.rules.push(resolveRule(rule));
    return this.merge({ rules });
  }

  concat(rules) {
    if (Schema.isSchema(rules)) rules = rules.rules;
    rules = [].concat(rules).map(resolveRule);

    return this.merge({
      rules: this.rules.concat(rules)
    });
  }
}

function resolveRule(r = {}) {
  if (typeof r.match !== "function") {
    throw new Error("Rule is missing a match method");
  }

  if (r.transform && typeof r.transform !== "function") {
    throw new Error("Rule has an invalid transform method");
  }

  return r;
}
