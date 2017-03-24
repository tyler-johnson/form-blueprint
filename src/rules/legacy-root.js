// rule for v1 root objects

import Blueprint from "../blueprint";

function match(bp) {
  return !bp.type &&
    !bp.options.size &&
    bp.props.size;
}

function normalize(bp) {
  return Blueprint.create({
    type: "section",
    options: bp.props.toJSON()
  });
}

export default {
  match,
  normalize
};
