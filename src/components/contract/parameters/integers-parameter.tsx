import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BaseParameter, BaseParameterProps } from "./base-parameter";

type IntegersParameterProps = Omit<
  BaseParameterProps,
  "type" | "children" | "value"
> & {
  value: number[];
};

export function IntegersParameter(props: IntegersParameterProps) {
  const { value = [], onUpdate, isInRule = false } = props;
  const [tempValue, setTempValue] = useState("");
  const currentValues = value as number[];

  const handleAdd = () => {
    if (!tempValue) return;
    const num = parseInt(tempValue, 10);
    if (isNaN(num)) return;
    onUpdate([...currentValues, num]);
    setTempValue("");
  };

  const handleRemove = (index: number) => {
    onUpdate(currentValues.filter((_, i) => i !== index));
  };

  const renderContent = () => {
    if (!isInRule) {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {currentValues.map((item, index) => (
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
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder="Add number"
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1">
        <div className="flex flex-wrap gap-1 border rounded px-2 py-1 bg-background min-w-[120px]">
          {currentValues.length > 0 ? (
            currentValues.map((item, index) => (
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
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">[]</span>
          )}
        </div>
        <div className="flex gap-1">
          <Input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Add number"
            className="h-6 w-20 px-1 py-0 text-sm bg-background"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <BaseParameter {...props} type="Integers">
      {renderContent()}
    </BaseParameter>
  );
}
