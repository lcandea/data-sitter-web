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
import { hideLoading, showLoading } from "@/store/slices/loading";
import {
  fetchContractLink,
  fetchContractPermissions,
} from "@/store/slices/contractShare";
import { useToast } from "@/hooks/useToast";

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

  const { loading, error } = useAppSelector((state) => state.contractShare);

  useEffect(() => {
    if (loading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [dispatch, loading]);

  useEffect(() => {
    if (contractId) {
      dispatch(fetchContractLink(contractId));
      dispatch(fetchContractPermissions(contractId));
    }
  }, [dispatch, contractId]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [toast, error]);

  return (
    <Dialog open={!loading && open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Contract</DialogTitle>
        </DialogHeader>
        <LinkSection contractId={contractId} />
        <Separator className="my-6" />
        <PermissionsSection contractId={contractId} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
