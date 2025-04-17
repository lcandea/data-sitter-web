import { useContract } from "@/hooks/useContract";
import { Validate } from "@/components/validate";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ValidatePage() {
  const navigate = useNavigate();

  const { contract } = useContract();
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Validate Data</h1>
      </div>
      <Validate contract={contract} />
    </div>
  );
}
