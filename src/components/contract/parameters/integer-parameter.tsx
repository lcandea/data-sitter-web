import { Input } from "@/components/ui/input";
import { BaseParameter, BaseParameterProps } from "./base-parameter";

type IntegerParameterProps = Omit<
  BaseParameterProps,
  "type" | "children" | "value"
> & {
  value: number;
};

export function IntegerParameter(props: IntegerParameterProps) {
  const { value, placeholder, name, isInRule, onUpdate } = props;

  return (
    <BaseParameter {...props} type="Integer">
      <Input
        type="number"
        value={(value as number) ?? ""}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          if (!isNaN(num)) onUpdate(num);
        }}
        placeholder={placeholder ?? name}
        className={
          isInRule
            ? "h-6 w-[120px] px-1 py-0 text-sm bg-background"
            : "h-8 w-full"
        }
        step="1"
      />
    </BaseParameter>
  );
}
