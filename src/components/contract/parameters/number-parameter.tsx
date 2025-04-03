import { Input } from "@/components/ui/input";
import { BaseParameter, BaseParameterProps } from "./base-parameter";

type NumberParameterProps = Omit<
  BaseParameterProps,
  "type" | "children" | "value"
> & {
  value: number;
};

export function NumberParameter(props: NumberParameterProps) {
  const { value, placeholder, name, isInRule, onUpdate } = props;

  return (
    <BaseParameter {...props} type="Number">
      <Input
        type="number"
        value={value ?? ""}
        onChange={(e) => {
          const num = parseFloat(e.target.value);
          if (!isNaN(num)) onUpdate(num);
        }}
        placeholder={placeholder ?? name}
        className={
          isInRule
            ? "h-6 w-[120px] px-1 py-0 text-sm bg-background"
            : "h-8 w-full"
        }
        step="0.01"
      />
    </BaseParameter>
  );
}
