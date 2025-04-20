import { ensureUserLoggedIn, supabase } from "./supabase";
import {
  ContractPermission,
  ContractPermissionRole,
  mapToContractPermission,
} from "@/lib/database-types";

export const fetchContractPermissions = async (
  contractId: string
): Promise<ContractPermission[]> => {
  await ensureUserLoggedIn();

  const { data, error } = await supabase.rpc("get_contract_permissions", {
    input_contract_id: contractId,
  });

  if (error) throw new Error(error.message);
  return data.map(mapToContractPermission);
};

export const createUserPermission = async (
  contractId: string,
  email: string,
  role: ContractPermissionRole
): Promise<ContractPermission> => {
  await ensureUserLoggedIn();
  const { data, error } = await supabase.rpc("add_contract_permission", {
    input_contract_id: contractId,
    input_email: email,
    input_role: role,
  });
  if (error) throw new Error(error.message);
  return mapToContractPermission(data[0]);
};

export const removeUserPermission = async (
  contractId: string,
  email: string
): Promise<boolean> => {
  await ensureUserLoggedIn();
  const { data, error } = await supabase.rpc("remove_contract_permission", {
    input_contract_id: contractId,
    input_email: email,
  });
  if (error) throw new Error(error.message);
  return data as boolean;
};

export const updateUserPermission = async (
  contractId: string,
  email: string,
  role: ContractPermissionRole
): Promise<ContractPermission> => {
  await ensureUserLoggedIn();
  const { data, error } = await supabase.rpc(
    "update_contract_permission_role",
    {
      input_contract_id: contractId,
      input_email: email,
      new_role: role,
    }
  );
  if (error) throw new Error(error.message);
  return mapToContractPermission(data[0]);
};
