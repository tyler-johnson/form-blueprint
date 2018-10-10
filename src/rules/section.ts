// rule for section composition

import { List } from "immutable";
import { Rule } from "../schema";
import { Field } from "../field";

function isPlainObject(o: any): o is { [key: string]: any; } {
  return o != null && o.constructor === Object;
}

const sectionRule: Rule = {
  match(field) {
    return field.type === "section";
  },
  transform(value, field) {
    if (typeof value === "undefined") value = {};
    if (!isPlainObject(value)) return value;

    const result: { [key: string]: any; } = {};
    const keys: string[] = Object.keys(value); // one list for order
    const uniqKeys = new Set<string>(keys);    // another list for uniqueness

    for (const child of field.children) {
      if (child.key && !uniqKeys.has(child.key)) {
        keys.push(child.key);
        uniqKeys.add(child.key);
      }
    }

    for (const key of keys) {
      const child = field.getChildField(key);
      if (!child) result[key] = value[key];
      else result[key] = this.transform(value[key], child);
    }

    return result;
  },
  join(a, b) {
    if (b.type !== "section") return a;

    const keys = new Set<string | null>();
    let children = List<Field>();

    for (const { key } of a.children.concat(b.children)) {
      if (keys.has(key)) continue;
      keys.add(key);

      const aopt = a.getChildField(key);
      const bopt = b.getChildField(key);
      const opt = !aopt ? bopt : !bopt ? aopt : this.join(aopt, bopt);
      if (opt) children = children.push(opt);
    }

    return a.merge({ children });
  }
};

export default sectionRule;
