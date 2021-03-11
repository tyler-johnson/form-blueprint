import color from "color";
import { Rule } from "../schema";

const colorRule: Rule = {
  match(field) {
    return field.type === "color";
  },
  normalize(field) {
    const { props } = field;
    const def = props.get("default");

    return field.merge({
      props: props.set("default", color(def).hex()),
    });
  },
  transform(field, val) {
    return color(val).hex();
  },
};

export default colorRule;
