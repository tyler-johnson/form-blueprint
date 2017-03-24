import Blueprint from "./blueprint";
import Schema, {defaultSchema} from "./schema";
import Field from "./field";
import * as rules from "./rules/index";

export {
  Blueprint,
  Schema,
  Field,
  defaultSchema,
  rules
};

export default function(field, schema=defaultSchema) {
  return Blueprint.create({ root: field, schema });
}
