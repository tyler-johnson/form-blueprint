// rule for v1 type-less sections

function match(bp) {
  return !bp.type && bp.options;
}

function normalize(bp) {
  if (bp.type !== "section") {
    return bp.merge({ type: "section" });
  }
}

export default {
  match,
  normalize
};
