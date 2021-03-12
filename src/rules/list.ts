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
      children: Field.createList([child]),
    });
  },
  serialize(field) {
    return field.merge({
      children: field.children.clear(),
    });
  },
  transform(field, value) {
    if (!Array.isArray(value)) return value;

    const child = field.children.first(undefined);
    if (!child) return value;

    return value.map((v) => {
      return this.transform(child, v);
    });
  },
  join(field, mergeIn) {
    return field.merge({
      props: field.props.merge(mergeIn.props),
      // remove children completely, normalize() will fix it
      children: field.children.clear(),
    });
  },
};

export default listRule;
