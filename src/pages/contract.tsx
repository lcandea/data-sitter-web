import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/useToast";
import { ContractEditor } from "@/components/contract/ContractEditor";
import { useContract } from "@/hooks/useContract";
import { useAppSelector } from "@/hooks/useStore";
import { ErrorDialog } from "@/components/ui/ErrorDialog";
import { ChevronLeftCircle, Save, Share2, UploadCloud } from "lucide-react";
import { ShareContractDialog } from "@/components/share-contract";
import { Validate } from "@/components/validate";

export function ContractPage() {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [validateOpen, setValidateOpen] = useState(false);

  const {
    error,
    contract,
    hasChanged,
    setContract,
    clearContract,
    fetchContract,
    saveContractLocally,
    saveContractToCloud,
    syncLocalContractToCloud,
    updateContract,
  } = useContract();

  useEffect(() => {
    if (id) {
      if (!contract || contract.id !== id) {
        fetchContract(id);
      }
    } else {
      clearContract();
    }
  }, [id]);

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

  const handleUpdate = async () => {
    if (!id) return;
    if (checkContract()) {
      await updateContract(id);
    }
  };

  const handleUpload = async () => {
    if (!id) return;
    const newId = await syncLocalContractToCloud(id);
    if (newId) navigate(`/contract/${newId}`);
  };

  const handleShare = async () => {
    if (!id) return;
    if (checkContract()) {
      await updateContract(id);
      setShareDialogOpen(true);
    }
  };

  if (validateOpen) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Data Validation</h1>
          <Button
            className="w-full md:w-auto md:ml-auto"
            variant="secondary"
            onClick={() => setValidateOpen(false)}
          >
            <ChevronLeftCircle className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
        </div>
        <Validate contract={contract} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Contract</h1>
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
          {id ? (
            <>
              {user &&
                (id.startsWith("local-") ? (
                  <Button variant="outline" onClick={handleUpload}>
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                ))}
              <Button
                variant="outline"
                onClick={handleUpdate}
                disabled={!hasChanged}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <>
              {user && (
                <Button variant="outline" onClick={handleSaveToCloud}>
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Save to Cloud
                </Button>
              )}
              <Button variant="outline" onClick={handleSaveLocally}>
                <Save className="h-4 w-4 mr-2" />
                Save Locally
              </Button>
            </>
          )}
        </div>
      </div>

      <ContractEditor
        contract={contract}
        onChange={setContract}
        openExternalValidator={setValidateOpen}
      />

      {id && (
        <ShareContractDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          contractId={id!}
        />
      )}

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
