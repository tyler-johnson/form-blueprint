import { Field } from "../field";
import { Rule } from "../schema";

const childrenRule: Rule = {
  match(field) {
    return field.children.size > 0;
  },
  normalize(field) {
    return field.merge({
      children: Field.mergeChildren(this.join.bind(this), field.children),
    });
  },
};

export default childrenRule;
