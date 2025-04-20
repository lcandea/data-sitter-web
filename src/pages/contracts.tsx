import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, Trash2, UploadCloud } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
  deleteContract,
  fetchUserContracts,
  syncLocalContractToCloud,
} from "@/store/slices/contract";
import { hideLoading, showLoading } from "@/store/slices/loading";
import { ShareContractDialog } from "@/components/share-contract";
import { ContractPermissionRole } from "@/lib/database-types";
import { Badge } from "@/components/ui/badge";
import { ErrorDialog } from "@/components/ui/ErrorDialog";
import { CreateContractDialog } from "@/components/CreateContract";

// Role display mapping
const roleDisplayMap: Record<
  ContractPermissionRole,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "accent";
  }
> = {
  owner: { label: "Owner", variant: "default" },
  writer: { label: "Writer", variant: "secondary" },
  validator: { label: "Validator", variant: "outline" },
  reader: { label: "Reader", variant: "outline" },
  local: { label: "Local", variant: "accent" },
};

export function ContractsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { userContracts, loading, error } = useAppSelector(
    (state) => state.contract
  );
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openNewContract, setOpenNewContract] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchUserContracts());
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [dispatch, loading]);

  const handleUpload = async (contractId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const reuslt = await dispatch(syncLocalContractToCloud(contractId));
    if (reuslt.meta.requestStatus === "rejected") return;
    dispatch(fetchUserContracts());
  };

  const handleShare = (contractId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedContractId(contractId);
    setShareDialogOpen(true);
  };

  const handleDelete = (contractId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedContractId(contractId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContractId) {
      dispatch(deleteContract(selectedContractId));
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Contracts</h1>
        <Button onClick={() => setOpenNewContract(true)}>
          Create Contract
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract Name</TableHead>
              <TableHead className="w-[50px] text-center">Role</TableHead>
              <TableHead className="w-[50px] text-center">Fields</TableHead>
              <TableHead className="w-[100px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userContracts.map((contract) => (
              <TableRow
                key={contract.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/contract/${contract.id}`)}
              >
                <TableCell className="font-medium">{contract.name}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={roleDisplayMap[contract.role].variant}>
                    {roleDisplayMap[contract.role].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {contract.fields_count}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2 h-9">
                    {["local", "owner"].includes(contract.role) && (
                      <>
                        {contract.role === "owner" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleShare(contract.id, e)}
                          >
                            <Share2 className="h-5 w-5" />
                          </Button>
                        )}
                        {contract.role === "local" && user && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleUpload(contract.id, e)}
                          >
                            <UploadCloud className="h-5 w-5" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDelete(contract.id, e)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateContractDialog
        open={openNewContract}
        onOpenChange={setOpenNewContract}
      />

      <ShareContractDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        contractId={selectedContractId!}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Contract"
        message="Are you sure you want to delete this contract? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
      />

      <ErrorDialog
        open={!!error}
        onOpenChange={() => {
          navigate("/");
        }}
        message={error!}
      />
    </div>
  );
}
