import { Record } from "immutable";
import { toPath } from "lodash";
import Schema from "./schema";
import Field from "./field";

const DEFAULTS = {
  root: null,
  schema: null
};

export default class Blueprint extends Record(DEFAULTS) {
  static create(props = {}) {
    if (Blueprint.isBlueprint(props)) {
      return props;
    }

    props.root = Field.create(props.root);
    props.schema = Schema.create(props.schema);

    return new Blueprint(props).normalize();
  }

  static isBlueprint(b) {
    return b instanceof Blueprint;
  }

  static kind() {
    return "blueprint";
  }

  getField(key) {
    const path = toPath(key);
    let field = this.root;

    while (path.length && field) {
      field = field.getChildField(path.shift());
    }

    return field;
  }

  transform(value) {
    return this.schema.transform(value, this.root);
  }

  normalize() {
    return this.merge({
      root: this.schema.normalize(this.root)
    });
  }

  join(...blueprints) {
    const fields = [this].concat(blueprints).map(b => b.root);
    const root = this.schema.join(...fields);
    return this.merge({ root });
  }
}
