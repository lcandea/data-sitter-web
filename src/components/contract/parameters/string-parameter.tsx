import { Input } from "@/components/ui/input";
import { BaseParameter, BaseParameterProps } from "./base-parameter";

type StringParameterProps = Omit<
  BaseParameterProps,
  "type" | "children" | "value"
> & {
  value: string;
};

export function StringParameter(props: StringParameterProps) {
  const { value, placeholder, name, isInRule, onUpdate } = props;

  return (
    <BaseParameter {...props} type="String">
      <Input
        type="text"
        value={value ?? ""}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={placeholder ?? name}
        className={
          isInRule
            ? "h-6 w-[120px] px-1 py-0 text-sm bg-background"
            : "h-8 w-full"
        }
      />
    </BaseParameter>
  );
}
