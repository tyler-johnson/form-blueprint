import { Record } from "immutable";
import toPath from "lodash.topath";
import { Schema, SchemaCreate } from "./schema";
import { Field, FieldCreate } from "./field";

export interface BlueprintRecord {
  root: Field;
  schema: Schema;
}

const DEFAULTS = {
  root: new Field(),
  schema: new Schema(),
};

export interface BlueprintCreate {
  root?: FieldCreate;
  schema?: SchemaCreate;
}

export class Blueprint extends Record(DEFAULTS) {
  /**
   * Create a new Blueprint from a field and a schema.
   * @param props Object with a root field and a schema.
   */
  static create(props?: BlueprintCreate) {
    if (Blueprint.isBlueprint(props)) {
      return props;
    }

    const blueprint = new Blueprint({
      root: Field.create(props?.root),
      schema: Schema.create(props?.schema),
    });

    return blueprint.normalize();
  }

  static isBlueprint(b: any): b is Blueprint {
    return b != null && b.__form_blueprint__ === true;
  }

  private get __form_blueprint__() {
    return true;
  }

  get kind() {
    return "blueprint";
  }

  /**
   * Get a field in a blueprint by key. The key can be complex to get deep values (eg. `a[0].b.c`).
   * @param key A field key.
   */
  getField(key: string) {
    const path = toPath(key);
    let field: Field | undefined = this.root;

    for (const part of path) {
      if (!field) return;
      field = field.findChildByKey(part);
    }

    return field;
  }

  /**
   * Transforms a value according to the blueprint and schema rules. Value does not need to be provided, in which case
   * default values are returned.
   * @param value A value to transform.
   */
  transform(value?: any) {
    return this.schema.transform(this.root, value);
  }

  /**
   * Normalize the blueprint's root field
   */
  normalize() {
    return this.merge({
      root: this.schema.normalize(this.root),
    });
  }

  /**
   * Merges blueprints' root fields into this one and returns a new blueprint. Blueprints' root fields are merged
   * left-to-right, with the right-most blueprint replacing data in those left of it. The blueprints' schemas are left
   * untouched, and the schema of the blueprint that join is called on is used to perform the join.
   */
  join(...blueprints: Blueprint[]) {
    return this.merge({
      root: this.schema.join(this.root, ...blueprints.map((b) => b.root)),
    });
  }

  /**
   * Convert this blueprint into an object that can be stringified or passed back to Blueprint.create().
   *
   * Internally, this is calling the blueprint's schema's serialize() on the blueprint's root field.
   */
  serialize() {
    return this.schema.serialize(this.root).serialize();
  }
}
