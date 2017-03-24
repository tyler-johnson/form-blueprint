// rule for v1 root objects

import Field from "../field";

function match(field) {
  return !field.type &&
    !field.children.size &&
    field.props.size;
}

function normalize(field) {
  return Field.create({
    key: field.key,
    type: "section",
    children: field.props.toJSON()
  });
}

export default {
  match,
  normalize
};
