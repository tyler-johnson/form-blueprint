// rule for section composition

import { List, Set } from "immutable";

function match(bp) {
  return bp.type === "section";
}

function transform(value, blueprint) {
  if (typeof value === "undefined") value = {};
  if (value == null || value.constructor !== Object) return value;

  const keys = Object.keys(value);
  blueprint.options.forEach(o => {
    if (o.key && !keys.includes(o.key)) keys.push(o.key);
  });

  return keys.reduce((m, k) => {
    const bp = blueprint.getOption(k);
    if (!bp) m[k] = value[k];
    else m[k] = this.transform(value[k], bp);
    return m;
  }, {});
}

function join(a, b) {
  if (b.type !== "section") return a;

  const keys = Set(a.options.map(o => o.key))
    .union(b.options.map(o => o.key));

  const options = keys.reduce((m, key) => {
    const aopt = a.getOption(key);
    const bopt = b.getOption(key);
    if (!aopt && !bopt) return m;
    const opt = !aopt ? bopt : !bopt ? aopt : this.join(aopt, bopt);
    return m.push(opt);
  }, List());

  return a.merge({ options });
}

export default {
  match,
  transform,
  join
};
