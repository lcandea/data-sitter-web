import { useState } from "react";
import { Copy, RefreshCw, Link2, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
  createContractLink,
  deleteContractLink,
  refreshLink,
  updateLinkIsActive,
} from "@/store/slices/contractShare";
import { useNavigate } from "react-router-dom";

interface LinkSectionProps {
  contractId: string;
}

export function LinkSection({ contractId }: LinkSectionProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { link: contractLink } = useAppSelector((state) => state.contractShare);

  const [copied, setCopied] = useState(false);

  const onGenerateLink = async () => {
    const request = await dispatch(createContractLink(contractId));
    if (request.meta.requestStatus === "fulfilled") {
      toast({
        title: "Link Generated",
        description: "A new shareable link has been created.",
      });
    }
  };

  const onRefreshLink = async () => {
    const request = await dispatch(refreshLink());
    if (request.meta.requestStatus === "fulfilled") {
      toast({
        title: "Link Refreshed",
        description: "The shareable link has been refreshed.",
      });
    }
  };

  const onRevokeLink = async () => {
    const request = await dispatch(deleteContractLink());
    if (request.meta.requestStatus === "fulfilled") {
      toast({
        title: "Link Revoked",
        description: "The shareable link has been revoked.",
      });
    }
  };

  const onPreviewLink = () => {
    navigate(`/shared/${contractLink?.token}`);
  };

  const toggleActive = async (isActive: boolean) => {
    if (contractLink) {
      const request = await dispatch(updateLinkIsActive(isActive));
      if (request.meta.requestStatus === "fulfilled") {
        toast({
          title: isActive ? "Link Activated" : "Link Deactivated",
          description: isActive
            ? "The shareable link is now active."
            : "The shareable link has been deactivated.",
        });
      }
    }
  };

  const handleCopy = async () => {
    if (!contractLink) return;

    const linkUrl = `${window.location.origin}/shared/${contractLink.token}`;
    await navigator.clipboard.writeText(linkUrl);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Link Copied",
      description: "The shareable link has been copied to your clipboard.",
    });
  };

  if (!contractLink) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This contract is private and only visible to you.
        </p>
        <Button onClick={onGenerateLink}>
          <Link2 className="h-4 w-4 mr-2" />
          Create Shareable Link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        This contract is accessible to anyone with the link.
      </p>

      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={`${window.location.origin}/shared/${contractLink.token}`}
          className={!contractLink.isActive ? "text-muted-foreground" : ""}
        />
        <Button variant="outline" size="icon" onClick={handleCopy}>
          <Copy className={`h-4 w-4 ${copied ? "text-green-500" : ""}`} />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onRefreshLink}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Link
          </Button>
          <Button variant="outline" size="sm" onClick={onRevokeLink}>
            <XCircle className="h-4 w-4 mr-2" />
            Revoke Link
          </Button>
          <Button variant="outline" size="sm" onClick={onPreviewLink}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Link
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="link-active"
            checked={contractLink.isActive}
            onCheckedChange={toggleActive}
          />
          <Label htmlFor="link-active">
            {contractLink.isActive ? "Active" : "Inactive"}
          </Label>
        </div>
      </div>
    </div>
  );
}
