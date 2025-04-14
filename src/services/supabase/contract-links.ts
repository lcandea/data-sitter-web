import { ensureUserLoggedIn, supabase } from "./supabase";
import { customAlphabet } from "nanoid";
import {
  ContractLink,
  mapToContractLink,
  mapToContractLinkDTO,
} from "@/lib/database-types";

const CONTRACT_LINKS_TABLE = "contract_links";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 8);

async function generateUniqueToken() {
  let token, exists;
  do {
    token = nanoid();
    const { data } = await supabase
      .from(CONTRACT_LINKS_TABLE)
      .select("id")
      .eq("token", token);
    exists = (data || []).length > 0;
  } while (exists);

  return token;
}

export const fetchContractLink = async (
  contractId: string
): Promise<ContractLink | null> => {
  await ensureUserLoggedIn();
  const { data, error } = await supabase
    .from(CONTRACT_LINKS_TABLE)
    .select("*")
    .eq("contract_id", contractId);

  if (error) throw new Error(error.message);
  if (data.length === 0) return null;
  if (data.length > 1)
    console.warn("There were more than 1 link for the contract:", data.length);
  return mapToContractLink(data[0]);
};

export const createContractLink = async (
  contractId: string
): Promise<ContractLink> => {
  await ensureUserLoggedIn();
  const contractLink = {
    contractId,
    token: await generateUniqueToken(),
    isActive: true,
  } as ContractLink;

  const { data, error } = await supabase
    .from(CONTRACT_LINKS_TABLE)
    .insert(mapToContractLinkDTO(contractLink))
    .select("*");

  if (error) throw new Error(error.message);
  return data[0];
};

export const refreshLink = async (linkId: string): Promise<string> => {
  await ensureUserLoggedIn();
  const newToken = await generateUniqueToken();

  const { data, error } = await supabase
    .from(CONTRACT_LINKS_TABLE)
    .update({ token: newToken })
    .eq("id", linkId)
    .select("token");

  if (error) throw new Error(error.message);
  return data[0].token as string;
};

export const updateLinkIsActive = async (
  linkId: string,
  isActive: boolean
): Promise<boolean> => {
  await ensureUserLoggedIn();

  const { data, error } = await supabase
    .from(CONTRACT_LINKS_TABLE)
    .update({ is_active: isActive })
    .eq("id", linkId)
    .select("is_active");

  if (error) throw new Error(error.message);
  return data[0].is_active as boolean;
};

export const deleteContractLink = async (linkId: string): Promise<boolean> => {
  await ensureUserLoggedIn();
  const { error } = await supabase
    .from(CONTRACT_LINKS_TABLE)
    .delete()
    .eq("id", linkId);

  if (error) throw new Error(error.message);
  return true;
};
