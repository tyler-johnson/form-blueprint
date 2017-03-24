// rule for v1 type-less sections

import Field from "../field";

function match(field) {
  return !field.type && field.props.has("options");
}

function normalize(field) {
  const opts = field.props.get("options");

  return field.merge({
    type: "section",
    children: Field.createList(opts)
  });
}

export default {
  match,
  normalize
};
