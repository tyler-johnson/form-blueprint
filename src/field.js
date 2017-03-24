import { Record, Map, List } from "immutable";

const DEFAULTS = {
  key: null,
  type: null,
  children: null,
  props: null
};

export default class Field extends Record(DEFAULTS) {
  static create(field = {}) {
    if (Field.isField(field)) {
      return field;
    }

    if (typeof field !== "object" || field == null) {
      throw new Error("Expecting object for field.");
    }

    let {
      key=null,
      type=null,
      children,
      ...props
    } = field;

    children = Field.createList(children);
    props = Map.isMap(props) ? props : Map(props);

    return new Field({ key, type, props, children });
  }

  static createList(fields) {
    if (List.isList(fields)) return fields;

    if (Array.isArray(fields)) {
      fields = fields.map(Field.create);
    } else if (typeof fields === "object" && fields != null) {
      fields = Object.keys(fields).map(key => {
        return Field.create({ ...fields[key], key });
      });
    }

    return List(fields);
  }

  static isField(b) {
    return b instanceof Field;
  }

  static kind() {
    return "field";
  }

  getChildField(key) {
    return this.children.find(o => o.key === key);
  }
}
