import { useState } from "react";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImportDialogProps {
  importContract: (content: string, fileType: "YAML" | "JSON") => Promise<void>;
}

export function ImportDialog({ importContract }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
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
        importContract(content, fileType);

        setOpen(false);
        toast({
          title: "Success",
          description: "Contract imported successfully",
        });
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Contract</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="file"
            accept=".json,.yaml"
            onChange={handleFileSelect}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
