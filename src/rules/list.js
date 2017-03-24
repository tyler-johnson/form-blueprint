// rule for list composition

import Blueprint from "../blueprint";

function match(blueprint) {
  return blueprint.type === "list";
}

function normalize(blueprint) {
  const option = blueprint.props.get("option");
  if (!option) return blueprint;

  return blueprint.merge({
    options: Blueprint.createList([ option ])
  });
}

function transform(value, blueprint) {
  if (!Array.isArray(value)) return value;

  const option = blueprint.options.first();
  if (!option) return value;

  return value.map(v => {
    return this.transform(v, option);
  });
}

export default {
  match,
  normalize,
  transform
};
