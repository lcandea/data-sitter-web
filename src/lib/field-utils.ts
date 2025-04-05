import { DataSitterValidator, FieldDefinition } from "data-sitter";

let cachedDefinitions: FieldDefinition[] | null = null;

export async function getAllRulesForField(
  fieldType: string
): Promise<string[]> {
  if (!cachedDefinitions) {
    cachedDefinitions = await DataSitterValidator.getFieldDefinitions();
  }

  const field = cachedDefinitions.find((f) => f.field === fieldType);
  if (!field) return [];

  const rules = [...field.rules];

  field.parent_field.forEach((parentType) => {
    const parentRules =
      cachedDefinitions!.find((f) => f.field === parentType)?.rules || [];
    rules.push(...parentRules);
  });

  return [...new Set(rules)];
}

export async function getFieldDefinitions(): Promise<FieldDefinition[]> {
  if (!cachedDefinitions) {
    cachedDefinitions = await DataSitterValidator.getFieldDefinitions();
  }
  return cachedDefinitions;
}
