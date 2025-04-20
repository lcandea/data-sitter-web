import { ContractPermissionRole, ContractPreview } from "@/lib/database-types";
import { DSContract } from "@/lib/types";
import Dexie, { type Table } from "dexie";
import type { DBCoreMutateRequest, DBCoreMutateResponse } from "dexie";

interface LocalContract {
  id: string;
  contract: DSContract;
  role: ContractPermissionRole;
}

class ContractDB extends Dexie {
  contracts!: Table<LocalContract, string>;

  constructor() {
    super("ContractDB");

    this.version(1).stores({
      contracts: "id, contract.name, role",
    });

    // Add middleware to handle UUID generation with proper typing
    this.use({
      stack: "dbcore",
      name: "uuidMiddleware",
      create: (downlevelDatabase) => ({
        ...downlevelDatabase,
        table: (tableName) => {
          const downlevelTable = downlevelDatabase.table(tableName);
          return {
            ...downlevelTable,
            mutate: (req: DBCoreMutateRequest) => {
              if (
                (req.type === "add" || req.type === "put") &&
                !req.keys?.length
              ) {
                req.values = req.values.map((value) => ({
                  ...value,
                  id: value.id || `local-${crypto.randomUUID()}`,
                }));
              }
              return downlevelTable.mutate(
                req
              ) as Promise<DBCoreMutateResponse>;
            },
          };
        },
      }),
    });
  }
}

const db = new ContractDB();

export const fetchContract = async (
  contractId: string
): Promise<DSContract | null> => {
  const localContract = await db.contracts.get(contractId);
  return localContract?.contract ?? null;
};

export const fetchUserContracts = async (): Promise<ContractPreview[]> => {
  const contracts = await db.contracts.toArray();
  return contracts.map(({ id, contract, role }) => ({
    id,
    name: contract.name,
    fields_count: contract.fields.length,
    role,
  }));
};

export const createContract = async (contract: DSContract): Promise<string> => {
  const id = await db.contracts.add({
    contract,
    role: "local",
  } as LocalContract);
  return id;
};

export const updateContract = async (
  contractId: string,
  newContract: DSContract
): Promise<boolean> => {
  const updated = await db.contracts.update(contractId, {
    contract: newContract,
  });
  return updated > 0;
};

export const deleteContract = async (contractId: string): Promise<boolean> => {
  const count = await db.contracts.where({ id: contractId }).delete();
  return count > 0;
};
