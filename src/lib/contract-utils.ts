import { parseRuleTemplate } from "./rule-parser";
import { Contract, ContractField, ContractValue, Rule } from "./types";
import { FieldRule, Field, ImportData } from "data-sitter";

export function formatContractForExport(contract: Contract) {
  const formattedContract = {
    name: contract.name,
    fields: contract.fields.map((field) => ({
      field_name: field.name,
      field_type: field.type,
      field_rules: field.rules.map((rule) => {
        let ruleText = rule.rule;

        // Replace parameter placeholders with their values or references
        rule.parameters?.forEach((param) => {
          const placeholder = `{${param.name}:${param.type}}`;
          let replacement: string = "";

          if (param.valueRef) {
            // valueRef is now directly the name of the value
            replacement = `$values.${param.valueRef}`;
          } else if (param.value !== undefined) {
            if (Array.isArray(param.value)) {
              replacement = `[${param.value
                .map((v) => (param.type === "Strings" ? `'${v}'` : v))
                .join(", ")}]`;
            } else {
              replacement =
                param.type === "String"
                  ? `'${param.value}'`
                  : String(param.value);
            }
          }

          if (replacement) {
            ruleText = ruleText.replace(placeholder, replacement);
          }
        });

        return ruleText;
      }),
    })),
    values: contract.values.reduce((acc, val) => {
      acc[val.name] = val.value;
      return acc;
    }, {} as Record<string, any>),
  };

  return formattedContract;
}

export function contractValuesFromValues(
  values: Record<string, any>
): ContractValue[] {
  return Object.entries(values).map(([name, value]) => ({
    id: crypto.randomUUID(),
    name,
    type: Array.isArray(value)
      ? typeof value[0] === "number"
        ? "Integers"
        : "Strings"
      : typeof value === "number"
      ? "Integer"
      : "String",
    value,
  }));
}

export function ruleFromFieldRule(
  fieldRule: FieldRule,
  values: ContractValue[]
): Rule {
  const ruleId = crypto.randomUUID();
  const parameters = parseRuleTemplate(fieldRule.rule);

  // Process parameters and their values
  parameters.forEach((param) => {
    const parsedValue = fieldRule.parsed_values[param.name];
    if (typeof parsedValue === "string" && parsedValue.startsWith("$values.")) {
      const valueName = parsedValue.replace("$values.", "");
      const valueRef = values.find((v) => v.name === valueName)?.name;
      if (valueRef) {
        param.valueRef = valueRef;
      }
    } else {
      param.value = parsedValue;
    }
  });

  return {
    id: ruleId,
    rule: fieldRule.rule,
    parameters,
  };
}

export function contractFieldFromField(
  field: Field,
  values: ContractValue[]
): ContractField {
  return {
    id: crypto.randomUUID(),
    name: field.field_name,
    type: field.field_type as any,
    description: "",
    rules: field.field_rules.map((fieldRule) =>
      ruleFromFieldRule(fieldRule, values)
    ),
  };
}

export function contractFromImportData(data: ImportData): Contract {
  const values = contractValuesFromValues(data.values);
  const fields = data.fields.map((field) =>
    contractFieldFromField(field, values)
  );
  return {
    name: data.name,
    fields,
    values,
  } as Contract;
}
