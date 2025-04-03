import { ReactNode, useState } from "react";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { ContractValue, ParameterType } from "@/lib/types";

export interface BaseParameterProps {
  name: string;
  type: ParameterType;
  value?: string | number | string[] | number[];
  valueRef?: string;
  placeholder?: string;
  isInRule?: boolean;
  isEditing?: boolean;
  availableValues?: ContractValue[];
  children: ReactNode;

  onUpdate: (
    value: string | number | string[] | number[],
    valueRef?: string
  ) => void;
}

function isCompatibleType(
  paramType: ParameterType,
  valueType: ParameterType
): boolean {
  if (paramType === valueType) return true;

  // Number parameters can accept Integer values
  if (paramType === "Number" && valueType === "Integer") return true;

  return false;
}

export function BaseParameter({
  type,
  valueRef,
  isInRule = false,
  isEditing = false,
  availableValues = [],
  onUpdate,
  children,
}: BaseParameterProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const compatibleValues = availableValues.filter((v) =>
    isCompatibleType(type, v.type)
  );
  const selectedValue = valueRef
    ? compatibleValues.find((v) => v.name === valueRef)
    : undefined;

  const handleTargetClick = () => {
    if (valueRef) {
      // If already synced, clear the reference and value
      onUpdate(type === "Strings" || type === "Integers" ? [] : "", undefined);
    } else {
      // If not synced, show the selector
      setIsPopoverOpen(true);
    }
  };

  const handleValueSelect = (selectedValue: ContractValue) => {
    onUpdate(selectedValue.value, selectedValue.name);
    setIsPopoverOpen(false);
  };

  const renderValuePreview = (value: ContractValue) => {
    if (Array.isArray(value.value)) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{value.name}</span>
            <Badge variant="secondary">{value.type}</Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {value.value.map((item, index) => (
              <Badge key={index} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{value.name}</span>
          <Badge variant="secondary">{value.type}</Badge>
        </div>
        <Badge variant="outline">{value.value}</Badge>
      </div>
    );
  };

  return (
    <div className="inline-flex items-center gap-1">
      {isEditing && selectedValue ? (
        <HoverCard>
          <HoverCardTrigger>
            <Badge
              variant="outline"
              className="text-green-500 border-green-500"
            >
              {selectedValue.name}
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            {renderValuePreview(selectedValue)}
          </HoverCardContent>
        </HoverCard>
      ) : (
        children
      )}

      {isInRule && compatibleValues.length > 0 && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 p-0 hover:bg-muted ${
                valueRef ? "text-green-500 hover:text-green-600" : ""
              }`}
              onClick={handleTargetClick}
            >
              <Target className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="space-y-1">
              {compatibleValues.map((val) => (
                <HoverCard key={val.name}>
                  <HoverCardTrigger asChild>
                    <Button
                      variant={valueRef === val.name ? "secondary" : "ghost"}
                      className="w-full justify-start text-sm"
                      onClick={() => handleValueSelect(val)}
                    >
                      {val.name}
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    {renderValuePreview(val)}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
