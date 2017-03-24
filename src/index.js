import Blueprint from "./blueprint";
import Schema, {defaultSchema} from "./schema";
import * as rules from "./rules/index";

export {
  Blueprint,
  Schema,
  defaultSchema,
  rules
};

export function normalize(blueprint, schema=defaultSchema) {
  blueprint = Blueprint.create(blueprint);
  schema = Schema.create(schema);
  return schema.normalize(blueprint);
}
