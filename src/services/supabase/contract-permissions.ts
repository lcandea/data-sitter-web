import { ensureUserLoggedIn, supabase } from "./supabase";
import {
  ContractPermission,
  mapToContractPermission,
  mapToContractPermissionDTO,
} from "@/lib/database-types";

const CONTRACT_PERMISSIONS_TABLE = "contract_permissions";

export const fetchContractPermissions = async (
  contractId: string
): Promise<ContractPermission[]> => {
  await ensureUserLoggedIn();

  const { data, error } = await supabase
    .from(CONTRACT_PERMISSIONS_TABLE)
    .select("*")
    .eq("contract_id", contractId);

  if (error) throw new Error(error.message);
  return data.map(mapToContractPermission);
};

export const createContractPermission = async (
  permission: ContractPermission
): Promise<string> => {
  await ensureUserLoggedIn();

  const { data, error } = await supabase
    .from(CONTRACT_PERMISSIONS_TABLE)
    .insert(mapToContractPermissionDTO(permission))
    .select("id");

  if (error) throw new Error(error.message);
  return data[0].id as string;
};

export const deleteContractPermission = async (
  id: string
): Promise<boolean> => {
  await ensureUserLoggedIn();
  const { error } = await supabase
    .from(CONTRACT_PERMISSIONS_TABLE)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};
