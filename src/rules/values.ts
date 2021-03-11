import { Field } from "../field";
import { Rule } from "../schema";
import { isNullOrEqual } from "../utils";

function getValues(field: Field) {
  const values = field.props.get("values");

  if (typeof values === "object" && values != null) {
    return values;
  }
}

const valuesRule: Rule = {
  match(field) {
    return getValues(field) != null;
  },
  normalize(field) {
    let values = getValues(field);
    if (values == null) return field;

    if (!Array.isArray(values)) {
      values = Object.keys(values).map((label) => {
        return { label, value: values[label] };
      });
    }

    values = values
      .map((v: any) => {
        if (typeof v === "string" && v) {
          return { label: v, value: v };
        } else if (typeof v === "object" && v) {
          return v;
        }
      })
      .filter(Boolean)
      .map((v: any) =>
        Field.create({
          ...v,
          type: "value-item",
        })
      );

    // don't remove values prop so this rule is still matched on join
    return field.merge({
      children: Field.createList(values),
    });
  },
  join(field, mergeIn) {
    // must match types
    if (!isNullOrEqual(field.type, mergeIn.type)) return;

    return field.merge({
      type: mergeIn.type ?? field.type,
      props: field.props.merge(mergeIn.props),
      // remove children completely, normalize() will fix it
      children: field.children.clear(),
    });
  },
};

export default valuesRule;
