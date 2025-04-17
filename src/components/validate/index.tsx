import { useState, useRef } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ValidationResult } from "@/components/validate/ValidationResult";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { clearResults } from "@/store/slices/validation";
import { Contract, TabRef } from "@/lib/types";
import { ErrorDialog } from "../ui/ErrorDialog";
import { FormTab } from "./tabs/FormTab";
import { JsonTab } from "./tabs/JsonTab";
import { CsvTab } from "./tabs/CsvTab";

interface ValidateProps {
  contract: Contract;
  pageSize?: number;
}

export function Validate({ contract, pageSize = 50 }: ValidateProps) {
  const dispatch = useAppDispatch();

  const { validationResult, loading, error } = useAppSelector(
    (state) => state.validation
  );

  const [activeTab, setActiveTab] = useState<string>("form");

  // Refs for each tab
  const tabRefs = {
    form: useRef<TabRef>(null),
    json: useRef<TabRef>(null),
    csv: useRef<TabRef>(null),
  };

  const handleClear = () => {
    const currentTabRef = tabRefs[activeTab as keyof typeof tabRefs].current;
    if (currentTabRef) {
      currentTabRef.clear();
    }
    dispatch(clearResults());
  };

  const handleValidate = async () => {
    const currentTabRef = tabRefs[activeTab as keyof typeof tabRefs].current;
    if (currentTabRef) {
      currentTabRef.validate(contract);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="csv">CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4 mt-6">
          <FormTab ref={tabRefs.form} contract={contract} />
        </TabsContent>

        <TabsContent value="json" className="mt-6">
          <JsonTab ref={tabRefs.json} />
        </TabsContent>

        <TabsContent value="csv" className="mt-6">
          <CsvTab ref={tabRefs.csv} pageSize={pageSize} />
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button
          className="flex-1"
          size="lg"
          onClick={handleValidate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : (
            "Validate"
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleClear}
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      {validationResult && (
        <div
          className={`p-6 rounded-lg border ${
            validationResult
              ? "bg-green-500/10 border-green-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}
        >
          <ValidationResult pageSize={pageSize} />
        </div>
      )}

      <ErrorDialog
        open={!!error}
        onOpenChange={() => {
          dispatch(clearResults());
        }}
        message={error!}
      />
    </div>
  );
}
