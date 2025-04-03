import { RuleParameter, ParameterType } from "./types";

export function parseRuleTemplate(template: string): RuleParameter[] {
  const paramRegex = /{([^:]+):([^}]+)}/g;
  const parameters: RuleParameter[] = [];
  
  let match;
  while ((match = paramRegex.exec(template)) !== null) {
    const [, name, type] = match;
    
    if (isValidParameterType(type)) {
      parameters.push({
        name,
        type: type as ParameterType,
        value: type === "Strings" || type === "Integers" ? [] : undefined
      });
    }
  }
  
  return parameters;
}

export function formatRuleWithParams(template: string, parameters: RuleParameter[]): string {
  let formatted = template;
  
  parameters.forEach(param => {
    const placeholder = `{${param.name}:${param.type}}`;
    formatted = formatted.replace(placeholder, param.value?.toString() ?? '_');
  });
  
  return formatted;
}

function isValidParameterType(type: string): type is ParameterType {
  return ['Integer', 'Number', 'String', 'Strings', 'Integers'].includes(type);
}