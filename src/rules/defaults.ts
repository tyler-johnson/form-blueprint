// rule for defaults

import { Rule } from "../schema";

const defaultRule: Rule = {
  match(field) {
    return field.props.has("default");
  },
  transform(value, field) {
    const def = field.props.get("default");
    return typeof value === "undefined" ? def : value;
  }
};

export default defaultRule;
