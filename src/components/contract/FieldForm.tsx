import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContractField, FieldType, ContractValue } from "@/lib/types";
import { getAllRulesForField, getFieldDefinitions } from "@/lib/field-utils";
import { RulesList } from "./RulesList";
import { isValidPythonIdentifier } from "@/lib/utils";
import { FieldDefinition } from "data-sitter";

type FieldFormProps = {
  field: ContractField;
  values: ContractValue[];
  existingFieldNames: string[];
  onUpdate: (field: ContractField) => void;
  onDelete: (name: string) => void;
};

export function FieldForm({
  field,
  values,
  existingFieldNames,
  onUpdate,
  onDelete,
}: FieldFormProps) {
  const [showRules, setShowRules] = useState(true);
  const [showTypeChangeAlert, setShowTypeChangeAlert] = useState(false);
  const [pendingFieldType, setPendingFieldType] = useState<FieldType | null>(
    null
  );
  const [nameError, setNameError] = useState<string | null>(null);
  const [fieldDefinitions, setFieldDefinitions] = useState<FieldDefinition[]>(
    []
  );
  const [availableRules, setAvailableRules] = useState<string[]>([]);

  useEffect(() => {
    const loadDefinitions = async () => {
      const definitions = await getFieldDefinitions();
      setFieldDefinitions(definitions.filter((f) => f.field != "BaseField"));
    };
    loadDefinitions();
  }, []);

  useEffect(() => {
    const loadRules = async () => {
      const rules = await getAllRulesForField(field.type);
      setAvailableRules(rules);
    };
    loadRules();
  }, [field.type]);

  const handleFieldUpdate = (updates: Partial<ContractField>) => {
    if ("name" in updates) {
      const name = updates.name || "";
      if (!name) {
        setNameError("Field name is required");
      } else if (!isValidPythonIdentifier(name)) {
        setNameError(
          "Valid characters are letters (a-z, A-Z), numbers (0-9), and underscore (_). Must start with a letter or underscore."
        );
      } else if (existingFieldNames.includes(name) && name !== field.name) {
        setNameError("A field with this name already exists");
      } else {
        setNameError(null);
      }
    }
    onUpdate({ ...field, ...updates });
  };

  const getRulesBadgeText = (count: number) => {
    if (count === 0) return "No rules";
    return `${count} ${count === 1 ? "Rule" : "Rules"}`;
  };

  const handleTypeChange = async (newType: FieldType) => {
    const newTypeRules = await getAllRulesForField(newType);
    const incompatibleRules = field.rules.filter(
      (rule) => !newTypeRules.includes(rule.rule)
    );

    if (incompatibleRules.length > 0) {
      setPendingFieldType(newType);
      setShowTypeChangeAlert(true);
    } else {
      handleFieldUpdate({ type: newType });
    }
  };

  const confirmTypeChange = async () => {
    if (!pendingFieldType) return;

    const newTypeRules = await getAllRulesForField(pendingFieldType);
    const compatibleRules = field.rules.filter((rule) =>
      newTypeRules.includes(rule.rule)
    );

    handleFieldUpdate({
      type: pendingFieldType,
      rules: compatibleRules,
    });

    setPendingFieldType(null);
    setShowTypeChangeAlert(false);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-[200px_200px_minmax(0,1fr)_auto] gap-4 items-end">
        <div>
          <Label
            htmlFor={`field-name-${field.id}`}
            className="text-sm font-medium"
          >
            Field Name
          </Label>
          <Input
            id={`field-name-${field.id}`}
            placeholder="Enter field name"
            value={field.name}
            onChange={(e) => handleFieldUpdate({ name: e.target.value })}
            className={nameError ? "border-red-500" : ""}
          />
          {nameError && (
            <p className="text-sm text-red-500 mt-1">{nameError}</p>
          )}
        </div>
        <div>
          <Label
            htmlFor={`field-type-${field.id}`}
            className="text-sm font-medium"
          >
            Field Type
          </Label>
          <Select value={field.type} onValueChange={handleTypeChange}>
            <SelectTrigger id={`field-type-${field.id}`} className="mt-1.5">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {fieldDefinitions.map((def) => (
                <SelectItem key={def.field} value={def.field}>
                  {def.field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor={`field-desc-${field.id}`}
            className="text-sm font-medium"
          >
            Description
          </Label>
          <Input
            id={`field-desc-${field.id}`}
            placeholder="Enter description"
            value={field.description}
            onChange={(e) => handleFieldUpdate({ description: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="secondary" className="mb-1">
            {getRulesBadgeText(field.rules.length)}
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onDelete(field.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowRules(!showRules)}
            >
              {showRules ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {showRules && (
        <RulesList
          rules={field.rules}
          availableRules={availableRules}
          values={values}
          onUpdate={(rules) => handleFieldUpdate({ rules })}
        />
      )}

      <AlertDialog
        open={showTypeChangeAlert}
        onOpenChange={setShowTypeChangeAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Incompatible Rules Detected</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the field type will remove any rules that are not
              compatible with the new type. Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPendingFieldType(null);
                setShowTypeChangeAlert(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmTypeChange}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
