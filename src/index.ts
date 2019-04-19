import { Blueprint } from "./blueprint";
import { Schema, SchemaCreate } from "./schema";
import { FieldCreate } from "./field";

import legacySection from "./rules/legacy-section";
import legacyRoot from "./rules/legacy-root";
import section from "./rules/section";
import list from "./rules/list";
import defaults from "./rules/defaults";

export * from "./blueprint";
export * from "./schema";
export * from "./field";

export const rules = [defaults, legacySection, legacyRoot, section, list];

export { legacySection, legacyRoot, section, list, defaults };

export const defaultSchema = Schema.create(rules);

export default function createBlueprint(
  root?: FieldCreate,
  schema: SchemaCreate = defaultSchema
) {
  return Blueprint.create({ root, schema });
}
