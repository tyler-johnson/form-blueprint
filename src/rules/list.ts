// rule for list composition

import { Field } from "../field";
import { Rule } from "../schema";

const listRule: Rule = {
  match(field) {
    return field.type === "list";
  },
  normalize(field) {
    const child = field.props.get("field");
    if (!child) return field;

    return field.merge({
      children: Field.createList([ child ])
    });
  },
  transform(value, field) {
    if (!Array.isArray(value)) return value;

    const child = field.children.first();
    if (!child) return value;

    return value.map((v) => {
      return this.transform(v, child);
    });
  }
};

export default listRule;
