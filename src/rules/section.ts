// rule for section composition

import { Field } from "../field";
import { Rule } from "../schema";

function isPlainObject(o: any): o is { [key: string]: any } {
  return o != null && o.constructor === Object;
}

const sectionRule: Rule = {
  match(field) {
    return field.type === "section";
  },
  transform(field, value) {
    if (typeof value === "undefined") value = {};
    if (!isPlainObject(value)) return value;

    const result: { [key: string]: any } = {};
    const keys = Object.keys(value); // one list for order
    const uniqKeys = new Set(keys); // another list for uniqueness
    const children = new Map<string, Field>(); // map to hold children

    for (const child of field.children) {
      if (child.key == null) continue;
      children.set(child.key, child);

      if (!uniqKeys.has(child.key)) {
        keys.push(child.key);
        uniqKeys.add(child.key);
      }
    }

    for (const key of keys) {
      const child = children.get(key);
      if (!child) result[key] = value[key];
      else result[key] = this.transform(child, value[key]);
    }

    return result;
  },
};

export default sectionRule;
