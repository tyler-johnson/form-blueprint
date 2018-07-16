import { Record } from "immutable";
import toPath = require("lodash.topath");
import { Schema, SchemaCreate } from "./schema";
import { Field, FieldCreate } from "./field";

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
  public static create(props?: BlueprintCreate) {
    if (Blueprint.isBlueprint(props)) {
      return props;
    }

    const blueprint = new Blueprint({
      root: Field.create(props && props.root),
      schema: Schema.create(props && props.schema)
    });

    return blueprint.normalize();
  }

  public static isBlueprint(b: any): b is Blueprint {
    return Boolean(b && b.kind === "blueprint");
  }

  public get kind() {
    return "blueprint";
  }

  public getField(key: string) {
    const path = toPath(key);
    let field: Field | undefined = this.root;

    for (const part of path) {
      if (!field) return;
      field = field.getChildField(part);
    }

    return field;
  }

  public transform(value?: any) {
    return this.schema.transform(value, this.root);
  }

  public normalize() {
    return this.merge({
      root: this.schema.normalize(this.root)
    });
  }

  public join(...blueprints: Blueprint[]) {
    return this.merge({
      root: this.schema.join(
        this.root,
        ...blueprints.map((b) => b.root)
      )
    });
  }
}
