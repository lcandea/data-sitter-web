import { supabase } from "./supabase";

interface Contract {
  name: string;
  fields: Field[];
  values: Record<string, any>;
}
interface Field {
  field_name: string;
  field_type: string;
  field_rules: string[];
}

const CONTRACTS_TABLE = "contracts";

export const fetchContract = async (id: string): Promise<Contract | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in.");
  const contracts = await supabase
    .from(CONTRACTS_TABLE)
    .select("contract")
    .eq("id", id);
  if (contracts.data && contracts.data.length)
    return contracts.data[0].contract as Contract;
  return null;
};

export const createConctract = async (contract: Contract): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in.");
  const toInsert = {
    user_id: user.id,
    name: contract.name,
    contract,
  };
  const { data, error } = await supabase
    .from(CONTRACTS_TABLE)
    .insert(toInsert)
    .select("id");
  if (error) throw new Error(error.message);
  console.log("contract/createConctract id:", data);
  return data[0].id as string;
};

export const updateConctract = async (
  id: string,
  newContract: Contract
): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in.");

  const toUpdate = {
    name: newContract.name,
    contract: newContract,
  };
  const { error } = await supabase
    .from(CONTRACTS_TABLE)
    .update(toUpdate)
    .eq("id", id);
  if (error) throw new Error(error.message);
  return true;
};
