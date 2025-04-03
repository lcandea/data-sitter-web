import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ContractValue, ParameterType } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { addValue, updateValue, removeValue } from "@/store/slices/values";
import { isValidPythonIdentifier } from "@/lib/utils";
import {
  StringParameter,
  NumberParameter,
  IntegerParameter,
} from "./parameters";
import { BaseParameterProps } from "./parameters/base-parameter";

export type SelectedParameterProps = Omit<
  BaseParameterProps,
  "type" | "children" | "value"
> & {
  value: number | string | number[] | string[];
};

function hasNumberArrayValue(
  value: ContractValue
): value is ContractValue & { value: number[] } {
  return value.type === "Integers" && Array.isArray(value.value);
}

function hasStringArrayValue(
  value: ContractValue
): value is ContractValue & { value: string[] } {
  return value.type !== "Integers" && Array.isArray(value.value);
}

export function ValuesDictionary() {
  const [addValueOpen, setAddValueOpen] = useState(false);
  const [newValue, setNewValue] = useState<Partial<ContractValue>>({});
  const [tempArrayValues, setTempArrayValues] = useState<
    Record<string, string>
  >({});
  const [nameError, setNameError] = useState<string | null>(null);
  const { toast } = useToast();

  const dispatch = useAppDispatch();
  const values = useAppSelector((state) => state.values.values);

  const handleNameChange = (name: string) => {
    setNewValue({ ...newValue, name });
    if (name && !isValidPythonIdentifier(name)) {
      setNameError(
        "Valid characters are letters (a-z, A-Z), numbers (0-9), and underscore (_). Must start with a letter or underscore."
      );
    } else {
      setNameError(null);
    }
  };

  const handleAddValue = () => {
    if (newValue.name && newValue.type) {
      if (!isValidPythonIdentifier(newValue.name)) {
        return;
      }

      if (values.some((v) => v.name === newValue.name)) {
        toast({
          title: "Error",
          description: "A value with this name already exists",
          variant: "destructive",
        });
        return;
      }

      const value: ContractValue = {
        id: crypto.randomUUID(),
        name: newValue.name,
        type: newValue.type as ParameterType,
        value:
          newValue.type === "Strings" || newValue.type === "Integers"
            ? []
            : newValue.value ?? "",
      };
      dispatch(addValue(value));
      setAddValueOpen(false);
      setNewValue({});
      setTempArrayValues({});
      setNameError(null);
    }
  };

  const handleRemoveValue = (id: string) => {
    dispatch(removeValue(id));
  };

  const handleArrayValueAdd = (value: ContractValue) => {
    const tempValue = tempArrayValues[value.id];
    if (!tempValue) return;

    if (hasNumberArrayValue(value)) {
      const parsedValue = parseInt(tempValue, 10);
      if (isNaN(parsedValue)) return;
      dispatch(
        updateValue({
          ...value,
          value: [...value.value, parsedValue],
        })
      );
    } else if (hasStringArrayValue(value)) {
      dispatch(
        updateValue({
          ...value,
          value: [...value.value, tempValue],
        })
      );
    } else {
      throw new Error(`Unrecognised Array Value: ${value.type}`);
    }
    setTempArrayValues((prev) => ({ ...prev, [value.id]: "" }));
  };

  const handleRemoveArrayValue = (value: ContractValue, index: number) => {
    if (!hasNumberArrayValue(value) || !hasStringArrayValue(value)) {
      throw new Error(`Unrecognised Array Value: ${value.type}`);
    }
    dispatch(
      updateValue({
        ...value,
        value: value.value.filter((_, i) => i !== index),
      })
    );
  };

  const renderValue = (cValue: ContractValue) => {
    if (cValue.type === "Strings" || cValue.type === "Integers") {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {(cValue.value as (string | number)[]).map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {item}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent text-destructive"
                  onClick={() => handleRemoveArrayValue(cValue, index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type={cValue.type === "Integers" ? "number" : "text"}
              value={tempArrayValues[cValue.id] || ""}
              onChange={(e) =>
                setTempArrayValues((prev) => ({
                  ...prev,
                  [cValue.id]: e.target.value,
                }))
              }
              placeholder={`Add ${
                cValue.type === "Integers" ? "number" : "value"
              }`}
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleArrayValueAdd(cValue);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => handleArrayValueAdd(cValue)}
            >
              Add
            </Button>
          </div>
        </div>
      );
    }

    const Parameter = {
      String: StringParameter,
      Integer: IntegerParameter,
      Number: NumberParameter,
    }[cValue.type] as React.ComponentType<SelectedParameterProps>;

    if (!Parameter) return null;

    return (
      <Parameter
        name={cValue.name}
        value={cValue.value}
        onUpdate={(newValue) => {
          dispatch(
            updateValue({
              ...cValue,
              value: newValue,
            })
          );
        }}
      />
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Values Dictionary</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Values Dictionary</SheetTitle>
        </SheetHeader>

        <div className="mt-8 h-[calc(100vh-10rem)] overflow-y-auto pr-4">
          <div className="space-y-6">
            {values.map((value) => (
              <div key={value.id} className="space-y-2 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{value.name}</h4>
                    <Badge variant="secondary">{value.type}</Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleRemoveValue(value.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {renderValue(value)}
              </div>
            ))}

            <Dialog open={addValueOpen} onOpenChange={setAddValueOpen}>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setAddValueOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Value
              </Button>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Value</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Value name"
                      value={newValue.name ?? ""}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={nameError ? "border-red-500" : ""}
                    />
                    {nameError && (
                      <p className="text-sm text-red-500 mt-1">{nameError}</p>
                    )}
                  </div>

                  <div>
                    <Select
                      value={newValue.type}
                      onValueChange={(value) =>
                        setNewValue({
                          ...newValue,
                          type: value as ParameterType,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Integer">Integer</SelectItem>
                        <SelectItem value="Number">Number</SelectItem>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Strings">Strings</SelectItem>
                        <SelectItem value="Integers">Integers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAddValueOpen(false);
                      setNewValue({});
                      setNameError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddValue}
                    disabled={!newValue.name || !newValue.type}
                  >
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
