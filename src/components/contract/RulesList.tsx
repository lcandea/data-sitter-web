import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Rule, ContractValue, RuleParameter } from "@/lib/types";
import { parseRuleTemplate } from "@/lib/rule-parser";
import {
  StringParameter,
  StringsParameter,
  NumberParameter,
  IntegerParameter,
  IntegersParameter,
} from "./parameters";

type RulesListProps = {
  rules: Rule[];
  availableRules: string[];
  values: ContractValue[];
  onUpdate: (rules: Rule[]) => void;
};

export function RulesList({
  rules,
  availableRules,
  values,
  onUpdate,
}: RulesListProps) {
  const [open, setOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<string>("");
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const handleAddRule = () => {
    if (selectedRule) {
      const newParameters = parseRuleTemplate(selectedRule);
      const ruleId = crypto.randomUUID();

      onUpdate([
        ...rules,
        {
          id: ruleId,
          rule: selectedRule,
          parameters: newParameters,
        },
      ]);

      setOpen(false);
      setSelectedRule("");
    }
  };

  const handleRemoveRule = (id: string) => {
    onUpdate(rules.filter((r) => r.id !== id));
    setEditingRuleId(null);
  };

  const handleParameterUpdate = (
    rule: Rule,
    paramName: string,
    value: string | number | string[] | number[],
    valueRef?: string
  ) => {
    const updatedRule = {
      ...rule,
      parameters: rule.parameters?.map((param) =>
        param.name === paramName ? { ...param, value, valueRef } : param
      ),
    };
    onUpdate(rules.map((r) => (r.id === rule.id ? updatedRule : r)));
  };

  const renderParameter = (rule: Rule, param: RuleParameter) => {
    if (!param) return null;

    const commonProps = {
      name: param.name,
      value: param.value,
      valueRef: param.valueRef,
      isInRule: true,
      isEditing: editingRuleId === rule.id,
      availableValues: values,
      onUpdate: (
        value: string | number | string[] | number[],
        valueRef?: string
      ) => handleParameterUpdate(rule, param.name, value, valueRef),
    };

    switch (param.type) {
      case "String":
        return (
          <StringParameter {...commonProps} value={param.value as string} />
        );
      case "Strings":
        return (
          <StringsParameter {...commonProps} value={param.value as string[]} />
        );
      case "Number":
        return (
          <NumberParameter {...commonProps} value={param.value as number} />
        );
      case "Integer":
        return (
          <IntegerParameter {...commonProps} value={param.value as number} />
        );
      case "Integers":
        return (
          <IntegersParameter {...commonProps} value={param.value as number[]} />
        );
      default:
        return null;
    }
  };

  const formatArrayValue = (value: (string | number)[], type: string) => {
    return `[${value
      .map((item) => (type === "Strings" ? `'${item}'` : item))
      .join(", ")}]`;
  };

  const formatValue = (value: string | number, type: string) => {
    return type === "String" ? `'${value}'` : value;
  };

  const renderRuleContent = (rule: Rule) => {
    const parts = rule.rule.split(/({[^}]+})/g);
    return parts.map((part, index) => {
      const paramMatch = part.match(/{([^:]+):([^}]+)}/);
      if (!paramMatch) return <span key={index}>{part}</span>;

      const [, paramName, paramType] = paramMatch;
      const parameter = rule.parameters?.find((p) => p.name === paramName);

      if (!parameter) return <span key={index}>{part}</span>;

      if (editingRuleId === rule.id) {
        return (
          <span key={index} className="mx-1">
            {renderParameter(rule, parameter)}
          </span>
        );
      }

      // If the parameter has a valueRef, get the value from the dictionary
      if (parameter.valueRef) {
        const dictValue = values.find((v) => v.name === parameter.valueRef);
        if (dictValue) {
          return (
            <HoverCard key={index}>
              <HoverCardTrigger>
                <span className="font-medium text-green-500">
                  {Array.isArray(dictValue.value)
                    ? formatArrayValue(dictValue.value, dictValue.type)
                    : formatValue(
                        dictValue.value as string | number,
                        dictValue.type
                      )}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{dictValue.name}</span>
                    <Badge variant="secondary">{dictValue.type}</Badge>
                  </div>
                  {Array.isArray(dictValue.value) ? (
                    <div className="flex flex-wrap gap-1">
                      {dictValue.value.map((item, i) => (
                        <Badge key={i} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Badge variant="outline">{dictValue.value}</Badge>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        }
      }

      // Show empty value based on parameter type
      if (!parameter.value) {
        if (paramType === "Strings" || paramType === "Integers") {
          return (
            <span key={index} className="font-medium">
              []
            </span>
          );
        }
        return (
          <span key={index} className="font-medium">
            _
          </span>
        );
      }

      if (Array.isArray(parameter.value)) {
        return (
          <span key={index} className="font-medium">
            {formatArrayValue(parameter.value, paramType)}
          </span>
        );
      }

      return (
        <span key={index} className="font-medium">
          {formatValue(parameter.value as string | number, paramType)}
        </span>
      );
    });
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium mb-4">Field Rules</h4>

      {rules.map((rule) => (
        <div key={rule.id} className="flex items-center gap-2">
          <div
            className={`flex-1 p-2 rounded-md text-sm ${
              editingRuleId === rule.id ? "bg-primary/10" : "bg-muted"
            }`}
          >
            {renderRuleContent(rule)}
          </div>
          {editingRuleId === rule.id ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-green-500 text-green-500 hover:bg-green-500/10"
                onClick={() => setEditingRuleId(null)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setEditingRuleId(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setEditingRuleId(rule.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => handleRemoveRule(rule.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Rule</DialogTitle>
          </DialogHeader>
          <Select value={selectedRule} onValueChange={setSelectedRule}>
            <SelectTrigger>
              <SelectValue placeholder="Select a rule" />
            </SelectTrigger>
            <SelectContent>
              {availableRules.map((rule) => (
                <SelectItem key={rule} value={rule}>
                  {rule}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setSelectedRule("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddRule} disabled={!selectedRule}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
