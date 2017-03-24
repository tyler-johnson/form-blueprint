// rule for defaults

function match(field) {
  return field.props.has("default");
}

function transform(value, field) {
  const def = field.props.get("default");

  return (typeof def !== "undefined") &&
    (typeof value === "undefined" || value === "") ?
    def : value;
}

export default {
  match,
  transform
};
