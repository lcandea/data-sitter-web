import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, Trash2 } from "lucide-react";
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
import { fetchUserContracts } from "@/store/slices/contract";
import { hideLoading, showLoading } from "@/store/slices/loading";
import { ShareContractDialog } from "@/components/share-contract";
import { ContractPermissionRole } from "@/lib/database-types";
import { Badge } from "@/components/ui/badge";

// Role display mapping
const roleDisplayMap: Record<
  ContractPermissionRole,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  owner: { label: "Owner", variant: "default" },
  writer: { label: "Writer", variant: "secondary" },
  validator: { label: "Validator", variant: "outline" },
  reader: { label: "Reader", variant: "outline" },
};

export function ContractsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user_contracts, loading, error } = useAppSelector(
    (state) => state.contract
  );
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

  if (error) {
    return <h1>Error: {error}</h1>;
  }

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
      // Here you would dispatch an action to delete the contract
      console.log(`Deleting contract ${selectedContractId}`);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Contracts</h1>
        <Button onClick={() => navigate("/contract")}>Create Contract</Button>
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
            {user_contracts.map((contract) => (
              <TableRow
                key={contract.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/contract/${contract.id}`)}
              >
                <TableCell className="font-medium">{contract.name}</TableCell>
                <TableCell>
                  <Badge variant={roleDisplayMap[contract.role].variant}>
                    {roleDisplayMap[contract.role].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {contract.fields_count}
                </TableCell>
                {contract.role === "owner" && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleShare(contract.id, e)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDelete(contract.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Share Dialog */}
      <ShareContractDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        contractId={selectedContractId!}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Contract"
        message="Are you sure you want to delete this contract? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
