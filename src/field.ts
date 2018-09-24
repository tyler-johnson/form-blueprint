import { Record, Map, List } from "immutable";
import { isIterable } from "./utils";

export interface FieldRecord {
  key: string | null;
  type: string | null;
  children: List<Field>;
  props: Map<string, any>;
}

const DEFAULTS: FieldRecord = {
  key: null,
  type: null,
  children: List(),
  props: Map()
};

export type FieldCreateProps = Iterable<[string, any]> | { [prop: string]: any };
export type FieldCreateList = Iterable<FieldCreate> | { [key: string]: FieldCreate };

export interface FieldCreate {
  key?: string | null;
  type?: string | null;
  children?: FieldCreateList;
  props?: FieldCreateProps;
  [key: string]: any;
}

export interface FieldSerialized {
  key: string | null;
  type: string | null;
  children: FieldSerialized[];
  props: {
    [key: string]: any;
  };
}

export class Field extends Record(DEFAULTS) {
  static create(field?: FieldCreate) {
    if (Field.isField(field)) {
      return field;
    }

    if (typeof field !== "object" || field == null) {
      field = {};
    }

    const {
      key = null,
      type = null,
      children,
      props = {},
      ...rest
    } = field;

    return new Field({
      key, type,
      props: Map(props).merge(rest),
      children: Field.createList(children)
    });
  }

  static createList(fields?: FieldCreateList) {
    let list: List<Field> = List();

    if (isIterable(fields)) {
      for (const field of fields) {
        list = list.push(Field.create(field));
      }
    } else if (typeof fields === "object" && fields != null) {
      for (const key of Object.keys(fields)) {
        // verify that the value is actually an object
        if (typeof fields[key] !== "object" || fields[key] == null) {
          continue;
        }

        list = list.push(Field.create({ key, ...fields[key] }));
      }
    }

    return list;
  }

  static isField(b: any): b is Field {
    return Boolean(b && b.kind === "field");
  }

  get kind() {
    return "field";
  }

  getChildField(key: string) {
    return this.children.find((field) => field.key === key);
  }

  serialize(): FieldSerialized {
    return {
      key: this.key,
      type: this.type,
      children: this.children.map((c) => c.serialize()).toArray(),
      props: this.props.toObject()
    };
  }
}
