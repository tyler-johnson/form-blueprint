import { Record, List } from "immutable";
import Blueprint from "./blueprint";
import rules from "./rules/index";

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

  apply(blueprint, prop, ...args) {
    return this.rules.reduce((b, rule) => {
      if (typeof rule[prop] !== "function") return b;
      if (!rule.match.call(this, b)) return b;
      const res = rule[prop].apply(this, [b].concat(args));
      return Blueprint.isBlueprint(res) ? res : b;
    }, blueprint);
  }

  normalize(blueprint) {
    blueprint = this.apply(blueprint, "normalize");
    const options = blueprint.options.map(bp => this.normalize(bp));
    return blueprint.merge({ options });
  }

  transform(value, blueprint) {
    return this.rules.reduce((val, rule) => {
      if (!rule.transform) return val;
      if (!rule.match.call(this, blueprint)) return val;
      return rule.transform.call(this, val, blueprint);
    }, value);
  }

  join(blueprint, ...toJoin) {
    return toJoin.reduce((m, b) => this.apply(m, "join", b), blueprint);
  }

  addRule(rule) {
    const rules = this.rules.push(resolveRule(rule));
    return this.merge({ rules });
  }

  concat(rules) {
    if (Schema.isSchema(rules)) rules = rules.rules;

    return this.merge({
      rules: this.rules.concat(rules)
    });
  }
}

export const defaultSchema = Schema.create(rules);

function resolveRule(r = {}) {
  if (typeof r.match !== "function") {
    throw new Error("Rule is missing a match method");
  }

  if (r.transform && typeof r.transform !== "function") {
    throw new Error("Rule has an invalid transform method");
  }

  return r;
}
