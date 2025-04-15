import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormTab, JsonTab, CsvTab } from "@/components/validate/tabs";
import { ValidationResult } from "@/components/validate/ValidationResult";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { clearResults } from "@/store/slices/validation";
import { useContract } from "@/hooks/useContract";
import { TabRef } from "@/lib/types";

export function ValidatePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { contract } = useContract();
  const { validationResult, loading } = useAppSelector(
    (state) => state.validation
  );

  const [activeTab, setActiveTab] = useState<string>("form");

  // Refs for each tab
  const tabRefs = {
    form: useRef<TabRef>(null),
    json: useRef<TabRef>(null),
    csv: useRef<TabRef>(null),
  };

  if (!contract) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Contract Data</h1>
          <p className="text-muted-foreground mb-4">
            Please go back and create or select a contract first.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contract
          </Button>
        </div>
      </div>
    );
  }

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
      currentTabRef.validate();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Validate Data</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="csv">CSV</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4 mt-6">
            <FormTab ref={tabRefs.form} />
          </TabsContent>

          <TabsContent value="json" className="mt-6">
            <JsonTab ref={tabRefs.json} />
          </TabsContent>

          <TabsContent value="csv" className="mt-6">
            <CsvTab ref={tabRefs.csv} />
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
            <ValidationResult />
          </div>
        )}
      </div>
    </div>
  );
}
