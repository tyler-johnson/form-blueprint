// rule for list composition

import section from "./section";

function match(bp) {
  return bp.type === "section-list";
}

function transform(value, blueprint) {
  if (!Array.isArray(value)) return value;

  return value.map(v => {
    return section.transform.call(this, v, blueprint);
  });
}

export default {
  match,
  transform
};
