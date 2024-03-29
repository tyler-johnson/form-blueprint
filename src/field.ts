import { Record, Map as ImmutableMap, List } from "immutable";
import { fromEntries, isIterable } from "./utils";

const createSymbol = Symbol("field create");
const conflictingSerializeKeys = new Set(["key", "type", "children", "props"]);

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

export class Field extends Record(DEFAULTS) {
  static create(field: FieldCreate = {}) {
    if (Field.isField(field)) {
      return field;
    }

    const { key, type, version, children, props, ...rest } = field;
    const propMap = ImmutableMap(rest);

    const fieldProps: FieldRecord = {
      key: key ?? undefined,
      type: type ?? undefined,
      props: props != null ? propMap.merge(props) : propMap,
      children: Field.createList(children),
    };

    Object.defineProperty(fieldProps, createSymbol, {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    return new Field(fieldProps);
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

  static mergeChildren(
    mergeFields: (...fields: Field[]) => Field,
    ...lists: Array<Iterable<Field | null | undefined> | Field | null | undefined>
  ) {
    const ordered: Array<string | Field> = [];
    const childrenMap = new Map<string, Field[]>();

    for (let list of lists) {
      if (Field.isField(list) || list == null) list = [list];

      for (const f of list) {
        if (!Field.isField(f)) continue;

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
        children.push(mergeFields(key));
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

  constructor(values?: Iterable<[string, any]> | Partial<FieldRecord> | undefined) {
    if (typeof process === "undefined" || process.env.NODE_ENV !== "production") {
      if (values == null || !(values as any)[createSymbol]) {
        console.warn("The Field constructor was called directly, usually via new Field(). Use Field.create() instead.");
      }
    }

    super(values);
  }

  findChildByKey(key?: string) {
    return this.children.find((field) =>
      key == null ? field.key == null : field.key == null ? false : field.key === key
    );
  }

  /** Convert this field back into an object that can be stringified or passed back to Field.create(). */
  serialize() {
    const result: FieldCreate = {};

    if (this.key != null) result.key = this.key;
    if (this.type != null) result.type = this.type;

    if (this.props.size) {
      // remove conflicting keys
      const conflicts = this.props.takeWhile((_, key) => conflictingSerializeKeys.has(key));
      const props = this.props.takeUntil((_, key) => conflictingSerializeKeys.has(key));

      // apply props in the right place
      if (conflicts.size) result.props = conflicts.toObject();
      if (props.size) Object.assign(result, props.toObject());
    }

    if (this.children.size) {
      const children = this.children.map((c) => c.serialize()).toArray();

      if (children.some((f) => f.key == null)) {
        result.children = children;
      } else {
        result.children = fromEntries(children.map(({ key, ...child }) => [key as string, child] as const));
      }
    }

    return result;
  }
}
