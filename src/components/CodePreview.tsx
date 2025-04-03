import { Card } from "@/components/ui/card";

export function CodePreview() {
  const code = {
    name: "test",
    fields: [
      {
        field_name: "FID",
        field_type: "IntegerField",
        field_rules: ["Positive"],
      },
      {
        field_name: "ID",
        field_type: "IntegerField",
        field_rules: ["Positive"],
      },
      {
        field_name: "SECCLASS",
        field_type: "StringField",
        field_rules: [
          "Validate Not Null",
          "Value In $values.classes",
        ],
      },
      {
        field_name: "NAME",
        field_type: "StringField",
        field_rules: [
          "Length Between $values.min_length and $values.max_length",
        ],
      },
    ],
    values: {
      classes: ["UNCLASSIFIED"],
      min_length: 5,
      max_length: 50,
    },
  };

  return (
    <Card className="bg-muted/50 p-6 overflow-hidden">
      <pre className="overflow-x-auto text-sm">
        <code className="language-json">
          {JSON.stringify(code, null, 2)}
        </code>
      </pre>
    </Card>
  );
}