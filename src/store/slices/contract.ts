import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Contract, ContractField } from "@/lib/types";
import { createAppAsyncThunk } from "..";
import {
  contractFromImportData,
  formatContractForExport,
} from "@/lib/contract-utils";
import * as db from "@/services/supabase/contracts";
import { DataSitterValidator } from "data-sitter";
import { setValues } from "./values";
import { ContractPreview } from "@/lib/database-types";
import { createLoadingAndErrorMatch, WithLoadingAndError } from "../helpers";

interface ContractState extends WithLoadingAndError {
  id: string | null;
  name: string | null;
  fields: ContractField[];
  userContracts: ContractPreview[];
}

const initialState: ContractState = {
  id: null,
  name: null,
  fields: [],
  userContracts: [],
  loading: false,
  error: null,
};

export const fetchUserContracts = createAppAsyncThunk(
  "contract/fetchUserContracts",
  async () => {
    const contracts = await db.fetchUserContracts();
    return contracts;
  }
);

export const fetchContract = createAppAsyncThunk(
  "contract/fetchContract",
  async (id: string, { dispatch }) => {
    const contract = await db.fetchContract(id);
    if (contract) {
      const validator = new DataSitterValidator(contract);
      const { name, fields, values } = contractFromImportData(
        await validator.getRepresentation()
      );
      dispatch(setValues(values));
      return { id, name, fields };
    }
    return null;
  }
);

export const fetchPublicContract = createAppAsyncThunk(
  "contract/fetchPublicContract",
  async (publicToken: string, { dispatch }) => {
    const contract = await db.fetchPublicContract(publicToken);
    if (contract) {
      const validator = new DataSitterValidator(contract);
      const { name, fields, values } = contractFromImportData(
        await validator.getRepresentation()
      );
      dispatch(setValues(values));
      return { name, fields };
    } else {
      throw new Error(
        "The public token does not exists or it has been dissabled."
      );
    }
    return null;
  }
);

export const importContract = createAppAsyncThunk(
  "contract/importContract",
  async (
    { content, fileType }: { content: string; fileType: "YAML" | "JSON" },
    { dispatch }
  ) => {
    let validator;
    if (fileType === "JSON") {
      validator = await DataSitterValidator.fromJson(content);
    } else {
      validator = await DataSitterValidator.fromYaml(content);
    }
    const importedContract = await validator.getRepresentation();
    const contract = contractFromImportData(importedContract);
    dispatch(setValues(contract.values));
    return contract;
  }
);

export const createContract = createAppAsyncThunk(
  "contract/createContract",
  async (_, { getState }) => {
    const { name, fields } = getState().contract;
    if (!name) throw Error("Contract name cannot be empty or null.");
    const { values } = getState().values;
    const newContract = formatContractForExport({
      id: null,
      name,
      fields,
      values,
    });
    const id = db.createContract(newContract);
    return id;
  }
);

export const updateContract = createAppAsyncThunk(
  "contract/updateContract",
  async (contractId: string, { getState }) => {
    const { id: storedId, name, fields } = getState().contract;
    if (contractId != storedId)
      throw Error("IDs does not match when trying to update");
    if (!name) throw Error("Contract name cannot be empty or null.");
    const { values } = getState().values;
    const updatedContract = formatContractForExport({
      id: null,
      name,
      fields,
      values,
    });
    await db.updateContract(contractId, updatedContract);
  }
);

export const deleteContract = createAppAsyncThunk(
  "contract/deleteContract",
  async (contractId: string) => {
    const deleted = await db.deleteContract(contractId);
    if (deleted) return contractId;
    return null;
  }
);

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string | null>) => {
      state.name = action.payload;
    },
    setFields: (state, action: PayloadAction<ContractField[]>) => {
      state.fields = action.payload;
    },
    setContract: (state, action: PayloadAction<Contract>) => {
      const { id, name, fields } = action.payload;
      state.id = id || null;
      state.name = name || null;
      state.fields = fields;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserContracts.fulfilled, (state, action) => {
        state.userContracts = action.payload;
      })
      .addCase(fetchContract.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, name, fields } = action.payload;
          state.id = id || null;
          state.name = name || null;
          state.fields = fields;
        }
      })
      .addCase(fetchPublicContract.fulfilled, (state, action) => {
        if (action.payload) {
          const { name, fields } = action.payload;
          state.id = null;
          state.name = name || null;
          state.fields = fields;
        }
      })
      .addCase(createContract.fulfilled, (state, action) => {
        const id = action.payload;
        state.id = id;
      })
      .addCase(importContract.fulfilled, (state, action) => {
        const { name, fields } = action.payload;
        state.name = name;
        state.fields = fields;
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        const deletedContractId = action.payload;
        if (deletedContractId) {
          state.userContracts = state.userContracts.filter(
            (p) => p.id !== deletedContractId
          );
        }
      });
    createLoadingAndErrorMatch("contract/")(builder);
  },
});
export const { setName, setFields, setContract, clearError } =
  contractSlice.actions;

export default contractSlice.reducer;
