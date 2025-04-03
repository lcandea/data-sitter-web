export type NavItem = {
  title: string;
  href: string;
};

export interface TabRef {
  validate: () => void;
  clear: () => void;
}

export type MainNavItem = NavItem;

export type DataInput = Record<string, any> | Record<string, any>[] | string;

export type FieldType =
  | "BaseField"
  | "StringField"
  | "NumericField"
  | "IntegerField"
  | "FloatField";

export type ParameterType =
  | "Integer"
  | "Number"
  | "String"
  | "Strings"
  | "Integers";

export type ContractValue = {
  id: string;
  name: string;
  type: ParameterType;
  value: string | number | string[] | number[];
};

export type RuleParameter = {
  name: string;
  type: ParameterType;
  value?: string | number | string[] | number[];
  valueRef?: string; // Reference to a value in the dictionary by name
};

export type Rule = {
  id: string;
  rule: string;
  parameters?: RuleParameter[];
};

export type ContractField = {
  id: string;
  name: string;
  type: FieldType;
  description: string;
  rules: Rule[];
};

export type Contract = {
  id: string | null;
  name: string;
  fields: ContractField[];
  values: ContractValue[];
};

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  onFileUpload?: (content: string) => void;
  options?: {
    readOnly?: boolean;
    [key: string]: any;
  };
}
