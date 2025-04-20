import { useState, forwardRef, useImperativeHandle } from "react";
import { Editor } from "@/components/validate/Editor";
import { useAppDispatch } from "@/hooks/useStore";
import { executeValidator } from "@/store/slices/validation";
import { Contract, TabRef } from "@/lib/types";
import { DataSitterValidator } from "data-sitter";
import { formatContractForExport } from "@/lib/contract-utils";

export const JsonTab = forwardRef<TabRef>((_, ref) => {
  const dispatch = useAppDispatch();

  const [jsonContent, setJsonContent] = useState("");

  useImperativeHandle(ref, () => ({
    async validate(contract: Contract) {
      const validator = new DataSitterValidator(
        formatContractForExport(contract)
      );

      dispatch(executeValidator(() => validator.validateData(jsonContent)));
    },
    clear() {
      setJsonContent("");
    },
  }));

  return (
    <Editor
      value={jsonContent}
      onChange={setJsonContent}
      title="JSON Data"
      onFileUpload={setJsonContent}
    />
  );
});

JsonTab.displayName = "JsonTab";
