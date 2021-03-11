import { Blueprint } from "./blueprint";
import { Schema, SchemaCreate } from "./schema";
import { FieldCreate } from "./field";

import legacySection from "./rules/legacy-section";
import legacyRoot from "./rules/legacy-root";
import section from "./rules/section";
import list from "./rules/list";
import defaults from "./rules/defaults";
import color from "./rules/color";
import values from "./rules/values";
import children from "./rules/children";

export * from "./blueprint";
export * from "./schema";
export * from "./field";

export const defaultRules = [defaults, legacySection, legacyRoot, section, list, color, values, children];
export const rules = { defaults, legacySection, legacyRoot, section, list, color, values, children };

export const defaultSchema = Schema.create(defaultRules);

export default function createBlueprint(root?: FieldCreate, schema: SchemaCreate = defaultSchema) {
  return Blueprint.create({ root, schema });
}
