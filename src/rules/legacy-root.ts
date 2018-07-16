// rule for v1 root objects

import { Field } from "../field";
import { Rule } from "../schema";

const legacyRoot: Rule = {
  match(field) {
    return !field.type && !field.children.size;
  },
  normalize(field) {
    return Field.create({
      key: field.key,
      type: "section",
      children: field.props.toJSON()
    });
  }
};

export default legacyRoot;
