// rule for defaults

function match(bp) {
  return bp.props.has("default");
}

function transform(value, bp) {
  const def = bp.props.get("default");

  return (typeof def !== "undefined") &&
    (typeof value === "undefined" || value === "") ?
    def : value;
}

export default {
  match,
  transform
};
