// rule for v1 type-less sections

import { Field } from "../field";
import { Rule } from "../schema";

const legacySection: Rule = {
  match(field) {
    return (!field.type || field.type === "section") && field.props.has("options");
  },
  normalize(field) {
    const opts = field.props.get("options");

    return field.merge({
      type: "section",
      children: Field.createList(opts)
    });
  }
};

export default legacySection;
