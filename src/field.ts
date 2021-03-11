import { Record, Map as ImmutableMap, List } from "immutable";
import { isIterable } from "./utils";

export interface FieldRecord {
  key?: string;
  type?: string;
  children: List<Field>;
  props: ImmutableMap<string, any>;
}

const DEFAULTS: FieldRecord = {
  key: undefined,
  type: undefined,
  children: List(),
  props: ImmutableMap(),
};

export type FieldCreateProps = Iterable<[string, any]> | { [prop: string]: any };
export type FieldCreateList = Iterable<FieldCreate> | { [key: string]: FieldCreate };

export interface FieldCreate {
  key?: string;
  type?: string;
  children?: FieldCreateList;
  props?: FieldCreateProps;
  [key: string]: any;
}

export interface FieldSerialized {
  key?: string;
  type?: string;
  children?: FieldSerialized[];
  props?: { [key: string]: any };
}

export class Field extends Record(DEFAULTS) {
  static create(field: FieldCreate = {}) {
    if (Field.isField(field)) {
      return field;
    }

    const { key, type, version, children, props, ...rest } = field;
    const propMap = ImmutableMap(rest);

    return new Field({
      key: key ?? undefined,
      type: type ?? undefined,
      props: props != null ? propMap.merge(props) : propMap,
      children: Field.createList(children),
    });
  }

  static createList(fields?: FieldCreateList) {
    const list: Field[] = [];

    if (isIterable(fields)) {
      for (const field of fields) {
        list.push(Field.create(field));
      }
    } else if (fields != null) {
      for (const [key, field] of Object.entries(fields)) {
        // must check that item is an object as data may be malformed
        if (typeof field === "object" && field != null) {
          list.push(Field.create({ key, ...field }));
        }
      }
    }

    return List(list);
  }

  static mergeChildren(mergeFields: (...fields: Field[]) => Field, ...lists: Array<Iterable<Field>>) {
    const ordered: Array<string | Field> = [];
    const childrenMap = new Map<string, Field[]>();

    for (const list of lists) {
      for (const f of list) {
        if (f.key == null) {
          ordered.push(f);
        } else {
          let fields = childrenMap.get(f.key);

          if (fields == null) {
            childrenMap.set(f.key, (fields = []));
            ordered.push(f.key);
          }

          fields.push(f);
        }
      }
    }

    const children: Field[] = [];

    for (const key of ordered) {
      if (typeof key === "string") {
        const fields = childrenMap.get(key);
        if (fields == null || !fields.length) continue;
        children.push(mergeFields(...fields));
      } else {
        children.push(key);
      }
    }

    return List(children);
  }

  static isField(b: any): b is Field {
    return b != null && b.__form_blueprint_field__ === true;
  }

  private get __form_blueprint_field__() {
    return true;
  }

  get kind() {
    return "field";
  }

  findChildByKey(key?: string) {
    return this.children.find((field) =>
      key == null ? field.key == null : field.key == null ? false : field.key === key
    );
  }

  serialize() {
    const result: FieldSerialized = {};
    if (this.key != null) result.key = this.key;
    if (this.type != null) result.type = this.type;
    if (this.children.size) result.children = this.children.map((c) => c.serialize()).toArray();
    if (this.props.size) result.props = this.props.toObject();
    return result;
  }
}
