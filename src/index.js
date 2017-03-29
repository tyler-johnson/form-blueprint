import Blueprint from "./blueprint";
import Schema from "./schema";
import Field from "./field";
import legacySection from "./rules/legacy-section";
import legacyRoot from "./rules/legacy-root";
import section from "./rules/section";
import list from "./rules/list";
import defaults from "./rules/defaults";

const rules = [
  legacySection,
  legacyRoot,
  section,
  list,
  defaults
];

const defaultSchema = Schema.create(rules);

function createBlueprint(field, schema=defaultSchema) {
  return Blueprint.create({ root: field, schema });
}

export {
  createBlueprint as default,
  Blueprint,
  Schema,
  Field,
  defaultSchema,
  rules,
  legacySection,
  legacyRoot,
  section,
  list,
  defaults
};
