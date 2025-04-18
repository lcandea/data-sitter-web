import { useEffect, useState } from "react";
import { Save, UploadCloud } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExportDialog } from "@/components/contract/ExportDialog";
import { useToast } from "@/hooks/useToast";
import { ContractEditor } from "@/components/contract/ContractEditor";
import { useContract } from "@/hooks/useContract";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { hideLoading, showLoading } from "@/store/slices/loading";
import { ErrorDialog } from "@/components/ui/ErrorDialog";
import { clearError } from "@/store/slices/contract";

export function PublicContractPage() {
  const { publicToken } = useParams();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exportOpen, setExportOpen] = useState(false);
  const {
    error,
    loading,
    contract,
    hasChanged,
    setContract,
    clearContract,
    fetchPublicContract,
    saveContractLocally,
    saveContractToCloud,
  } = useContract();

  useEffect(() => {
    if (publicToken) {
      fetchPublicContract(publicToken);
    } else {
      clearContract();
    }
  }, [fetchPublicContract, clearContract, publicToken]);

  useEffect(() => {
    if (loading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [dispatch, loading]);

  const checkContract = () => {
    if (!contract.name) {
      toast({
        title: "Error",
        description: "Please enter a contract name",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSaveLocally = async () => {
    if (checkContract()) {
      const newId = await saveContractLocally();
      navigate(`/contract/${newId}`);
    }
  };

  const handleSaveToCloud = async () => {
    if (checkContract()) {
      const newId = await saveContractToCloud();
      navigate(`/contract/${newId}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Create Contract</h1>
          {hasChanged && (
            <Badge
              variant="outline"
              className="text-yellow-500 border-yellow-500"
            >
              Unsaved Changes
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <Button variant="outline" onClick={handleSaveToCloud}>
              <UploadCloud className="h-4 w-4 mr-2" />
              Copy to Cloud
            </Button>
          )}
          <Button variant="outline" onClick={handleSaveLocally}>
            <Save className="h-4 w-4 mr-2" />
            Copy Locally
          </Button>
        </div>
      </div>

      <ContractEditor contract={contract} onChange={setContract} />

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        contract={contract}
      />

      <ErrorDialog
        open={!!error}
        onOpenChange={() => {
          dispatch(clearError());
          navigate("/");
        }}
        message={error!}
      />
    </div>
  );
}
