import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContractPermissionRole } from "@/lib/database-types";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useToast } from "@/hooks/useToast";
import {
  grantUserPermission,
  revokeUserPermission,
  updateUserPermission,
} from "@/store/slices/contractShare";

interface PermissionsSectionProps {
  contractId: string;
}

const ROLES: ContractPermissionRole[] = ["reader", "writer", "validator"];

export function PermissionsSection({ contractId }: PermissionsSectionProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { permissions: contractPermissions } = useAppSelector(
    (state) => state.contractShare
  );

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ContractPermissionRole>("reader");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (contractPermissions.some((p) => p.userEmail === email)) {
      setEmailError("This user already has access");
      return;
    }

    const request = await dispatch(
      grantUserPermission({ contractId, email, role })
    );
    if (request.meta.requestStatus === "fulfilled") {
      toast({
        title: "User Added",
        description: `${email} has been granted ${role.toLowerCase()} access.`,
      });
    }
    setEmail("");
    setEmailError(null);
  };

  const updateRole = async (email: string, role: ContractPermissionRole) => {
    const request = await dispatch(
      updateUserPermission({ contractId, email, role })
    );
    if (request.meta.requestStatus === "fulfilled") {
      toast({
        title: "Role Updated",
        description: `${email}'s role has been updated to ${role.toLowerCase()}.`,
      });
    }
  };

  const confirmRemoveUser = async (email: string) => {
    const request = await dispatch(revokeUserPermission({ contractId, email }));
    if (request.meta.requestStatus === "fulfilled") {
      toast({
        title: "User Removed",
        description: `${email}'s access has been removed.`,
      });
    }
    setConfirmDelete("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-4">
          Give access to specific people
        </h4>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              placeholder="Email address"
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as ContractPermissionRole)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">Add</Button>
        </form>
      </div>

      {contractPermissions.length > 0 && (
        <div className="border rounded-lg divide-y">
          {contractPermissions.map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between p-4"
            >
              <span className="text-sm font-medium">
                {permission.userEmail}
              </span>
              <div className="flex items-center gap-2">
                {confirmDelete === permission.userEmail ? (
                  <>
                    <Button
                      size="icon"
                      className="text-red-500"
                      variant="outline"
                      onClick={() => confirmRemoveUser(permission.userEmail)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setConfirmDelete("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Select
                      disabled={permission.role === "owner"}
                      value={permission.role}
                      onValueChange={(value) =>
                        updateRole(
                          permission.userEmail,
                          value as ContractPermissionRole
                        )
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {permission.role === "owner" ? (
                          <SelectItem key="owner" value="owner">
                            Owner
                          </SelectItem>
                        ) : (
                          ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      disabled={permission.role === "owner"}
                      variant="ghost"
                      size="icon"
                      onClick={() => setConfirmDelete(permission.userEmail)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
