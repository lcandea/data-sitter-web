import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Contract, ContractField } from "@/lib/types";
import { FieldForm } from "@/components/contract/FieldForm";
import { ValuesDictionary } from "@/components/contract/ValuesDictionary";
import { isValidPythonIdentifier } from "@/lib/utils";

interface ContractEditorProprs {
  contract: Contract;
  onChange: (newContract: Contract) => void;
}

export function ContractEditor({ contract, onChange }: ContractEditorProprs) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    setName(contract.name);
  }, [contract]);

  const handleNameChange = (name: string) => {
    setName(name);
    if (name && !isValidPythonIdentifier(name)) {
      setNameError(
        "Valid characters are letters (a-z, A-Z), numbers (0-9), and underscore (_). Must start with a letter or underscore."
      );
    } else {
      setNameError(null);
      onChange({ ...contract, name });
    }
  };

  const handleAddField = () => {
    const newField: ContractField = {
      id: crypto.randomUUID(),
      name: "",
      type: "BaseField",
      description: "",
      rules: [],
    };
    onChange({ ...contract, fields: [...contract.fields, newField] });
  };

  const handleUpdateField = (updatedField: ContractField) => {
    onChange({
      ...contract,
      fields: contract.fields.map((f) =>
        f.id === updatedField.id ? updatedField : f
      ),
    });
  };

  const handleDeleteField = (fieldId: string) => {
    onChange({
      ...contract,
      fields: contract.fields.filter((f) => f.id !== fieldId),
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Label htmlFor="contract-name" className="text-sm font-medium">
            Contract Name
          </Label>
          <Input
            id="contract-name"
            placeholder="Enter contract name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={nameError ? "border-red-500" : ""}
          />
          {nameError && (
            <p className="text-sm text-red-500 mt-1">{nameError}</p>
          )}
        </div>
        <ValuesDictionary />
      </div>

      <div className="space-y-4">
        {contract.fields.map((field) => (
          <FieldForm
            key={field.id}
            field={field}
            values={contract.values}
            existingFieldNames={contract.fields.map((f) => f.name)}
            onUpdate={handleUpdateField}
            onDelete={handleDeleteField}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleAddField}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>
    </div>
  );
}
