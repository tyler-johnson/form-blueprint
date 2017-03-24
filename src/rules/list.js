// rule for list composition

import Field from "../field";

function match(field) {
  return field.type === "list";
}

function normalize(field) {
  const child = field.props.get("field");
  if (!child) return field;

  return field.merge({
    children: Field.createList([ child ])
  });
}

function transform(value, field) {
  if (!Array.isArray(value)) return value;

  const child = field.children.first();
  if (!child) return value;

  return value.map(v => {
    return this.transform(v, child);
  });
}

export default {
  match,
  normalize,
  transform
};
