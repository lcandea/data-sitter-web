import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LinkSection } from "./LinkSection";
import { PermissionsSection } from "./PermissionsSection";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
  fetchContractLink,
  fetchContractPermissions,
} from "@/store/slices/contractShare";
import { useToast } from "@/hooks/useToast";
import { Loader2 } from "lucide-react";

interface ShareContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
}

export function ShareContractDialog({
  open,
  onOpenChange,
  contractId,
}: ShareContractDialogProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { link, permissions, loading, error } = useAppSelector(
    (state) => state.contractShare
  );

  useEffect(() => {
    if (contractId && open) {
      dispatch(fetchContractLink(contractId));
      dispatch(fetchContractPermissions(contractId));
    }
  }, [dispatch, contractId, open]);

  useEffect(() => {
    if (error && open) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [toast, error, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground text-center">
              {"Loading... Please wait."}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Share Contract</DialogTitle>
            </DialogHeader>
            <LinkSection contractId={contractId} contractLink={link} />
            <Separator className="my-6" />
            <PermissionsSection
              contractId={contractId}
              contractPermissions={permissions}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
