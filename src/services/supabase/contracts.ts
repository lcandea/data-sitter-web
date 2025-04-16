import { ContractPreview } from "@/lib/database-types";
import { ensureUserLoggedIn, supabase } from "./supabase";

interface Contract {
  name: string;
  fields: Field[];
  values: Record<string, unknown>;
}
interface Field {
  field_name: string;
  field_type: string;
  field_rules: string[];
}

const CONTRACTS_TABLE = "contracts";

export const fetchContract = async (id: string): Promise<Contract | null> => {
  await ensureUserLoggedIn();
  const contracts = await supabase
    .from(CONTRACTS_TABLE)
    .select("contract")
    .eq("id", id);
  if (contracts.data && contracts.data.length === 1)
    return contracts.data[0].contract as Contract;
  return null;
};

export const fetchPublicContract = async (
  publicToken: string
): Promise<Contract | null> => {
  const { data, error } = await supabase.rpc("get_contract_by_token", {
    public_token: publicToken,
  });

  if (error) throw new Error(error.message);
  return data as Contract;
};

export const fetchUserContracts = async (): Promise<ContractPreview[]> => {
  await ensureUserLoggedIn();
  const { data, error } = await supabase.rpc("get_contracts");
  if (error) throw new Error(error.message);
  return data;
};

export const createContract = async (contract: Contract): Promise<string> => {
  await ensureUserLoggedIn();
  const { data, error } = await supabase.rpc(
    "insert_contract_with_permission",
    {
      input_json: contract,
    }
  );

  if (error) throw new Error(error.message);
  return data as string;
};

export const updateContract = async (
  contractId: string,
  newContract: Contract
): Promise<boolean> => {
  await ensureUserLoggedIn();

  const toUpdate = {
    name: newContract.name,
    contract: newContract,
  };
  const { error } = await supabase
    .from(CONTRACTS_TABLE)
    .update(toUpdate)
    .eq("id", contractId);
  if (error) throw new Error(error.message);
  return true;
};

export const deleteContract = async (contractId: string): Promise<boolean> => {
  await ensureUserLoggedIn();

  const { error } = await supabase
    .from(CONTRACTS_TABLE)
    .delete()
    .eq("id", contractId);
  if (error) throw new Error(error.message);
  return true;
};
