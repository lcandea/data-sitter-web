import { useState } from "react";
import { Copy, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Contract } from "@/lib/types";
import { formatContractForExport } from "@/lib/contract-utils";
import { Editor } from "@/components/validate/Editor";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract;
}

export function ExportDialog({
  open,
  onOpenChange,
  contract,
}: ExportDialogProps) {
  const [copied, setCopied] = useState(false);

  const formatContract = () => {
    const formattedContract = formatContractForExport(contract);
    return JSON.stringify(formattedContract, null, 2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatContract());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formatContract()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contract.name || "contract"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Export Contract</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Editor
            value={formatContract()}
            onChange={() => {}}
            options={{ readOnly: true }}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
