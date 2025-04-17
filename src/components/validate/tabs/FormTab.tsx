import { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch } from "@/hooks/useStore";
import { executeValidator } from "@/store/slices/validation";
import { Contract, TabRef } from "@/lib/types";
import { DataSitterValidator } from "data-sitter";
import { formatContractForExport } from "@/lib/contract-utils";

interface FormTabProps {
  contract: Contract;
}

export const FormTab = forwardRef<TabRef, FormTabProps>(({ contract }, ref) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [nullFields, setNullFields] = useState<Record<string, boolean>>({});

  useImperativeHandle(ref, () => ({
    async validate(contract: Contract) {
      const data: Record<string, unknown> = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          nullFields[key] ? null : value,
        ])
      );
      const validator = new DataSitterValidator(
        formatContractForExport(contract)
      );

      dispatch(executeValidator(() => validator.validateData(data)));
    },
    clear() {
      setFormData({});
      setNullFields({});
    },
  }));

  if (!contract) return;

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleNullChange = (fieldName: string, checked: boolean) => {
    setNullFields((prev) => ({ ...prev, [fieldName]: checked }));

    setFormData((prev) => {
      const newData = { ...prev };
      if (checked) {
        newData[fieldName] = null;
      } else {
        delete newData[fieldName];
      }
      return newData;
    });
  };

  return (
    <div className="max-h-[600px] overflow-y-auto pr-4">
      {contract.fields.map((field) => (
        <div
          key={field.name}
          className="grid grid-cols-[1fr,auto] gap-4 items-start mb-4"
        >
          <div className="space-y-2">
            <Label htmlFor={field.name}>{field.name}</Label>
            <Input
              id={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={nullFields[field.name]}
            />
          </div>
          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              id={`null-${field.name}`}
              checked={nullFields[field.name] || false}
              onCheckedChange={(checked) =>
                handleNullChange(field.name, checked as boolean)
              }
            />
            <Label htmlFor={`null-${field.name}`}>Null</Label>
          </div>
        </div>
      ))}
    </div>
  );
});

FormTab.displayName = "FormTab";
