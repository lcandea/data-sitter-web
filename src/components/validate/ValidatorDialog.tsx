import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Contract } from "@/lib/types";
import { Validate } from ".";

interface ValidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract;
}

export function ValidateDialog({
  open,
  onOpenChange,
  contract,
}: ValidateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Validate Data
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <Validate contract={contract} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
