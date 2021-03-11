// rule for defaults

import { Rule } from "../schema";

const defaultsRule: Rule = {
  match(field) {
    return field.props.has("default");
  },
  transform(field, value) {
    const def = field.props.get("default");
    return typeof value === "undefined" ? def : value;
  },
};

export default defaultsRule;
