import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/useToast";
import { LinkSection } from "./LinkSection";
import { PermissionsSection } from "./PermissionsSection";
import {
  ContractPermission,
  ContractPermissionRole,
} from "@/lib/database-types";

const mockContractPermissions: ContractPermission[] = [
  {
    id: "1",
    contractId: "1",
    userId: "john.doe@example.com",
    role: "owner",
    createdAt: new Date(),
  },
  {
    id: "2",
    contractId: "1",
    userId: "jane.doe@example.com",
    role: "writer",
    createdAt: new Date(),
  },
];

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
  const [contractPermissions, setContractPermissions] = useState<
    ContractPermission[]
  >(mockContractPermissions);
  const { toast } = useToast();

  const onAddUser = (email: string, role: ContractPermissionRole) => {
    const newPermission: ContractPermission = {
      id: Math.random().toString(),
      contractId: "1",
      userId: email,
      role: role,
      createdAt: new Date(),
    };
    setContractPermissions([...contractPermissions, newPermission]);
    toast({
      title: "User Added",
      description: `${email} has been granted ${role.toLowerCase()} access.`,
    });
  };

  const updateRole = (email: string, role: ContractPermissionRole) => {
    setContractPermissions(
      contractPermissions.map((permission) =>
        permission.userId === email ? { ...permission, role } : permission
      )
    );
    toast({
      title: "Role Updated",
      description: `${email}'s role has been updated to ${role.toLowerCase()}.`,
    });
  };

  const onRemoveUser = (email: string) => {
    setContractPermissions(
      contractPermissions.filter((permission) => permission.userId !== email)
    );
    toast({
      title: "User Removed",
      description: `${email}'s access has been removed.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Contract</DialogTitle>
        </DialogHeader>

        <LinkSection contractId={contractId} />

        <Separator className="my-6" />

        <PermissionsSection
          contractPermissions={contractPermissions}
          onAddUser={onAddUser}
          updateRole={updateRole}
          onRemoveUser={onRemoveUser}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
