import { useEffect, useState } from "react";
import { FileJson, CheckCircle, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExportDialog } from "@/components/contract/ExportDialog";
import { ImportDialog } from "@/components/contract/ImportDialog";
import { useToast } from "@/hooks/useToast";
import { ContractEditor } from "@/components/contract/ContractEditor";
import { useContract } from "@/hooks/useContract";
import { useAppDispatch } from "@/hooks/useStore";
import { hideLoading, showLoading } from "@/store/slices/loading";
import { ErrorDialog } from "@/components/ui/ErrorDialog";

export function ContractPage() {
  const { id } = useParams();
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
    fetchContract,
    importContract,
    persistContract,
  } = useContract();

  useEffect(() => {
    if (id) {
      fetchContract(id);
    }
  }, [fetchContract, id]);

  useEffect(() => {
    if (loading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [dispatch, loading]);

  const handleSave = async () => {
    if (!contract.name) {
      toast({
        title: "Error",
        description: "Please enter a contract name",
        variant: "destructive",
      });
      return;
    }
    const newId = await persistContract();
    navigate(`/contract/${newId}`);
  };

  const handleValidate = () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Please save the contract first",
        variant: "destructive",
      });
      return;
    }
    navigate(`/contract/${id}/validate`);
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
          <ImportDialog importContract={importContract} />
          <Button onClick={() => setExportOpen(true)} disabled={hasChanged}>
            <FileJson className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={!hasChanged}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={handleValidate}
            disabled={hasChanged}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Validate Data
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
          navigate("/");
        }}
        message={error!}
      />
    </div>
  );
}
