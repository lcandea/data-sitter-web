import { useState, forwardRef, useImperativeHandle } from "react";
import { Editor } from "@/components/validate/Editor";
import { useAppDispatch } from "@/hooks/useStore";
import { executeValidator } from "@/store/slices/validation";
import { useContract } from "@/hooks/useContract";
import { TabRef } from "@/lib/types";

export const JsonTab = forwardRef<TabRef>((_, ref) => {
  const dispatch = useAppDispatch();
  const { validateData } = useContract();

  const [jsonContent, setJsonContent] = useState("");

  useImperativeHandle(ref, () => ({
    async validate() {
      dispatch(executeValidator(() => validateData(jsonContent)));
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
