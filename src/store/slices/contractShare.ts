import { createSlice } from "@reduxjs/toolkit";
import {
  ContractLink,
  ContractPermission,
  ContractPermissionRole,
} from "@/lib/database-types";
import * as linkDb from "@/services/supabase/contract-links";
import * as permDb from "@/services/supabase/contract-permissions";
import { createAppAsyncThunk } from "..";
import { createLoadingAndErrorMatch, WithLoadingAndError } from "../helpers";

interface ContractShareState extends WithLoadingAndError {
  link: ContractLink | null;
  permissions: ContractPermission[];
}

const initialState: ContractShareState = {
  link: null,
  permissions: [],
  loading: false,
  error: null,
};

export const fetchContractLink = createAppAsyncThunk(
  "contractShare/fetchContractLink",
  async (contractId: string) => {
    return await linkDb.fetchContractLink(contractId);
  }
);

export const createContractLink = createAppAsyncThunk(
  "contractShare/createContractLink",
  async (contractId: string) => {
    return await linkDb.createContractLink(contractId);
  }
);

export const refreshLink = createAppAsyncThunk(
  "contractShare/refreshLink",
  async (_, { getState }) => {
    const { link } = getState().contractShare;
    if (!link || !link.id)
      throw new Error("You cannot refresh a link when there is no link");
    return await linkDb.refreshLink(link.id);
  }
);

export const updateLinkIsActive = createAppAsyncThunk(
  "contractShare/updateLinkIsActive",
  async (isActive: boolean, { getState }) => {
    const { link } = getState().contractShare;
    if (!link || !link.id)
      throw new Error("You cannot update a link when there is no link");
    return await linkDb.updateLinkIsActive(link.id, isActive);
  }
);

export const deleteContractLink = createAppAsyncThunk(
  "contractShare/deleteContractLink",
  async (_, { getState }) => {
    const { link } = getState().contractShare;
    if (!link || !link.id)
      throw new Error("You cannot delete a link when there is no link");
    return await linkDb.deleteContractLink(link.id);
  }
);

export const fetchContractPermissions = createAppAsyncThunk(
  "contractShare/fetchContractPermissions",
  async (contractId: string) => {
    return await permDb.fetchContractPermissions(contractId);
  }
);

export const grantUserPermission = createAppAsyncThunk(
  "contractShare/grantUserPermission",
  async ({
    contractId,
    email,
    role,
  }: {
    contractId: string;
    email: string;
    role: ContractPermissionRole;
  }) => {
    return await permDb.createUserPermission(contractId, email, role);
  }
);

export const revokeUserPermission = createAppAsyncThunk(
  "contractShare/revokeUserPermission",
  async ({ contractId, email }: { contractId: string; email: string }) => {
    const result = await permDb.removeUserPermission(contractId, email);
    if (result) return email;
    return null;
  }
);

export const updateUserPermission = createAppAsyncThunk(
  "contractShare/updateUserPermission",
  async ({
    contractId,
    email,
    role,
  }: {
    contractId: string;
    email: string;
    role: ContractPermissionRole;
  }) => {
    return await permDb.updateUserPermission(contractId, email, role);
  }
);

const contractShareSlice = createSlice({
  name: "contractShare",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractLink.fulfilled, (state, action) => {
        state.link = action.payload;
      })
      .addCase(createContractLink.fulfilled, (state, action) => {
        state.link = action.payload;
      })
      .addCase(refreshLink.fulfilled, (state, action) => {
        const token = action.payload;
        state.link = { ...state.link!, token };
      })
      .addCase(updateLinkIsActive.fulfilled, (state, action) => {
        const isActive = action.payload;
        state.link = { ...state.link!, isActive };
      })
      .addCase(deleteContractLink.fulfilled, (state, action) => {
        const deleted = action.payload;
        if (deleted) state.link = null;
      })
      .addCase(fetchContractPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
      })
      .addCase(grantUserPermission.fulfilled, (state, action) => {
        state.permissions.push(action.payload);
      })
      .addCase(revokeUserPermission.fulfilled, (state, action) => {
        const revokedEmail = action.payload;
        if (revokedEmail) {
          state.permissions = state.permissions.filter(
            (p) => p.userEmail !== revokedEmail
          );
        }
      })
      .addCase(updateUserPermission.fulfilled, (state, action) => {
        const updatedRecord = action.payload;
        state.permissions = state.permissions.map((p) =>
          p.id === updatedRecord.id ? updatedRecord : p
        );
      });
    createLoadingAndErrorMatch("contractShare/")(builder);
  },
});

export default contractShareSlice.reducer;
