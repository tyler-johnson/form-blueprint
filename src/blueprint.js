import { Record, Map, List } from "immutable";
import Schema, {defaultSchema} from "./schema";

const DEFAULTS = {
  key: null,
  type: null,
  options: null,
  props: null
};

export default class Blueprint extends Record(DEFAULTS) {
  static create(blueprint = {}) {
    if (Blueprint.isBlueprint(blueprint)) return blueprint;

    if (typeof blueprint !== "object" || blueprint == null) {
      throw new Error("Expecting object for blueprint.");
    }

    let {
      key=null,
      type=null,
      options,
      ...props
    } = blueprint;

    options = Blueprint.createList(options);
    props = Map.isMap(props) ? props : Map(props);

    return new Blueprint({ key, type, options, props });
  }

  static createList(blueprints) {
    if (List.isList(blueprints)) return blueprints;

    if (Array.isArray(blueprints)) {
      blueprints = blueprints.map(Blueprint.create);
    } else if (typeof blueprints === "object" && blueprints != null) {
      blueprints = Object.keys(blueprints).map(key => {
        return Blueprint.create({ ...blueprints[key], key });
      });
    }

    return List(blueprints);
  }

  static isBlueprint(b) {
    return b instanceof Blueprint;
  }

  static kind() {
    return "blueprint";
  }

  getOption(key) {
    return this.options.find(o => o.key === key);
  }

  transform(value, schema=defaultSchema) {
    return schema.transform(value, this);
  }

  normalize(schema=defaultSchema) {
    return schema.normalize(this);
  }

  join(schema, ...args) {
    if (!Schema.isSchema(schema)) {
      args.unshift(schema);
      schema = defaultSchema;
    }

    return schema.join(this, ...args);
  }
}
