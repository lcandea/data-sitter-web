import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { useContract } from "@/hooks/useContract";

interface ImportContractProps {
  onBack: () => void;
  onOpenChange: (value: boolean) => void;
}

function ImportContract({ onBack, onOpenChange }: ImportContractProps) {
  const { importContract } = useContract();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const fileType = file.name.toLowerCase().endsWith(".yaml")
          ? "YAML"
          : "JSON";
        const newId = await importContract(content, fileType);
        if (!newId) throw Error();
        toast({
          title: "Success",
          description: "Contract imported successfully",
        });
        onBack();
        onOpenChange(false);
        navigate(`/contract/${newId}`);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description:
            "Failed to import contract. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <DialogTitle>Import Contract</DialogTitle>
            <DialogDescription>
              Import an existing contract from a JSON or YAML file
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="mt-6">
        <Card className="border-2 border-dashed">
          <CardHeader>
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
              <CardTitle className="text-center mb-2">
                Drop your file here
              </CardTitle>
              <CardDescription className="text-center mb-4">
                Supports JSON and YAML formats
              </CardDescription>
              <Button asChild variant="secondary">
                <label className="cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    accept=".json,.yaml,.yml"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}

interface CreateContractDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export function CreateContractDialog({
  open,
  onOpenChange,
}: CreateContractDialogProps) {
  const navigate = useNavigate();
  const [showImport, setShowImport] = useState(false);

  const handleCreate = () => {
    navigate("/contract");
    onOpenChange(false);
  };

  const handleImport = () => {
    setShowImport(true);
  };

  const handleBack = () => {
    setShowImport(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) setShowImport(false);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        {showImport ? (
          <ImportContract onBack={handleBack} onOpenChange={onOpenChange} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
              <DialogDescription>
                Choose how you want to create your contract
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleCreate}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Start Fresh
                  </CardTitle>
                  <CardDescription>
                    Create a new contract from scratch using our intuitive
                    editor
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleImport}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Import
                  </CardTitle>
                  <CardDescription>
                    Import an existing contract from a JSON or YAML file
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
