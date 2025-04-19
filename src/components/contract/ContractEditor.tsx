import { useEffect, useState } from "react";
import { CheckCircle, ChevronLeftCircle, FileJson, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Contract, ContractField } from "@/lib/types";
import { FieldForm } from "@/components/contract/FieldForm";
import { ValuesDictionary } from "@/components/contract/ValuesDictionary";
import { cn, isValidPythonIdentifier } from "@/lib/utils";
import { ExportDialog } from "./ExportDialog";
import { Validate } from "../validate";

interface ContractEditorProprs {
  contract: Contract;
  onChange: (newContract: Contract) => void;
  openExternalValidator?: (open: boolean) => void;
}

export function ContractEditor({
  contract,
  onChange,
  openExternalValidator,
}: ContractEditorProprs) {
  const [exportOpen, setExportOpen] = useState(false);
  const [validateOpen, setValidateOpen] = useState(false);
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

  const handleOpenValidate = (open: boolean) => {
    if (openExternalValidator) {
      openExternalValidator(open);
    } else {
      setValidateOpen(open);
    }
  };

  if (validateOpen) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-end gap-4 flex-1">
          <Button
            className="w-full md:w-auto md:ml-auto"
            variant="secondary"
            onClick={() => setValidateOpen(false)}
          >
            <ChevronLeftCircle className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
        </div>
        <Validate contract={contract} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 flex-1">
          {/* Left side - Contract Name and Values Dictionary */}
          <div className="w-full md:w-64 gap-4">
            <Label htmlFor="contract-name" className="text-sm font-medium">
              Contract Name
            </Label>
            <Input
              id="contract-name"
              placeholder="Enter contract name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={cn("mt-1.5", nameError ? "border-red-500" : "")}
            />
            {nameError && (
              <p className="text-sm text-red-500 mt-1">{nameError}</p>
            )}
          </div>
          <ValuesDictionary />
        </div>

        {/* Right side - Export and Validate buttons */}
        <div className="flex flex-row items-stretch md:items-end gap-4">
          <Button
            className="w-full md:w-auto"
            variant="outline"
            onClick={() => setExportOpen(true)}
          >
            <FileJson className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            className="w-full md:w-auto"
            variant="secondary"
            onClick={() => handleOpenValidate(true)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Validate Data
          </Button>
        </div>
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
      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        contract={contract}
      />
    </div>
  );
}
