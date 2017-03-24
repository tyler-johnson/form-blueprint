// rule for section composition

import { List, Set } from "immutable";

function match(field) {
  return field.type === "section";
}

function transform(value, field) {
  if (typeof value === "undefined") value = {};
  if (value == null || value.constructor !== Object) return value;

  const keys = Object.keys(value);
  field.children.forEach(o => {
    if (o.key && !keys.includes(o.key)) keys.push(o.key);
  });

  return keys.reduce((m, k) => {
    const child = field.getChildField(k);
    if (!child) m[k] = value[k];
    else m[k] = this.transform(value[k], child);
    return m;
  }, {});
}

function join(a, b) {
  if (b.type !== "section") return a;

  const keys = Set(a.children.map(o => o.key))
    .union(b.children.map(o => o.key));

  const children = keys.reduce((m, key) => {
    const aopt = a.getChildField(key);
    const bopt = b.getChildField(key);
    if (!aopt && !bopt) return m;
    const opt = !aopt ? bopt : !bopt ? aopt : this.join(aopt, bopt);
    return m.push(opt);
  }, List());

  return a.merge({ children });
}

export default {
  match,
  transform,
  join
};
