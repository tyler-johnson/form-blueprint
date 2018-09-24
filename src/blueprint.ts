import { Record } from "immutable";
import toPath = require("lodash.topath");
import { Schema, SchemaCreate } from "./schema";
import { Field, FieldCreate, FieldSerialized } from "./field";

export interface BlueprintRecord {
  root: Field;
  schema: Schema;
}

const DEFAULTS = {
  root: new Field(),
  schema: new Schema()
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
      root: Field.create(props && props.root),
      schema: Schema.create(props && props.schema)
    });

    return blueprint.normalize();
  }

  static isBlueprint(b: any): b is Blueprint {
    return Boolean(b && b.kind === "blueprint");
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
      field = field.getChildField(part);
    }

    return field;
  }

  /**
   * Transforms a value according to the blueprint and schema rules. Value does not need to be provided, in which case
   * default values are returned.
   * @param value A value to transform.
   */
  transform(value?: any) {
    return this.schema.transform(value, this.root);
  }

  /**
   * Normlaize a blueprint using schema rules. This generally doesn't need to be called as this run when a blueprint is
   * created.
   */
  normalize() {
    return this.merge({
      root: this.schema.normalize(this.root)
    });
  }

  /**
   * Joins one or more blueprints together into a single blueprint. The blueprint that join is called on is considered
   * the master blueprint. The master's schema is used to join and upon conflicts, the master's copy will always win.
   * @param blueprints One or more blueprints to merge into this blueprint.
   */
  join(...blueprints: Blueprint[]) {
    return this.merge({
      root: this.schema.join(
        this.root,
        ...blueprints.map((b) => b.root)
      )
    });
  }

  /**
   * Generates a plain object representing the blueprint fields. New blueprints can be created from the serialized
   * result.
   */
  serialize(): FieldSerialized {
    return this.root.serialize();
  }
}
