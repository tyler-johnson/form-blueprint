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

export class Field extends Record(DEFAULTS) {
  public static create(field?: FieldCreate) {
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

  public static createList(fields?: FieldCreateList) {
    let list: List<Field> = List();

    if (isIterable(fields)) {
      for (const field of fields) {
        list = list.push(Field.create(field));
      }
    } else if (typeof fields === "object" && fields != null) {
      for (const key of Object.keys(fields)) {
        list = list.push(Field.create({ key, ...fields[key] }));
      }
    }

    return list;
  }

  public static isField(b: any): b is Field {
    return Boolean(b && b.kind === "field");
  }

  private get kind() {
    return "field";
  }

  public getChildField(key: string) {
    return this.children.find((field) => field.key === key);
  }
}
