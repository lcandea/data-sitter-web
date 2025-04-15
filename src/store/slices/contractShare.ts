import {
  createSlice,
  createAsyncThunk,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import {
  ContractLink,
  ContractPermission,
  ContractPermissionRole,
} from "@/lib/database-types";
import * as linkDb from "@/services/supabase/contract-links";
import * as permDb from "@/services/supabase/contract-permissions";
import { createAppAsyncThunk } from "..";

interface ContractShareState {
  link: ContractLink | null;
  permissions: ContractPermission[];
  loading: boolean;
  error: string | null;
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

export const fetchContractPermissions = createAsyncThunk(
  "contractShare/fetchContractPermissions",
  async (contractId: string) => {
    return await permDb.fetchContractPermissions(contractId);
  }
);

export const grantUserPermission = createAsyncThunk(
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

export const revokeUserPermission = createAsyncThunk(
  "contractShare/revokeUserPermission",
  async ({ contractId, email }: { contractId: string; email: string }) => {
    const result = await permDb.removeUserPermission(contractId, email);
    if (result) return email;
    return null;
  }
);

export const updateUserPermission = createAsyncThunk(
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
        console.log("updatedRecord", updatedRecord);
        state.permissions = state.permissions.map((p) =>
          p.id === updatedRecord.id ? updatedRecord : p
        );
        console.log("state.permissions", state.permissions);
      })
      .addMatcher(
        (action): action is ReturnType<typeof isPending> =>
          isPending(action) && action.type.startsWith("contractShare/"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is ReturnType<typeof isFulfilled> =>
          isFulfilled(action) && action.type.startsWith("contractShare/"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action): action is ReturnType<typeof isRejected> =>
          isRejected(action) && action.type.startsWith("contractShare/"),
        (state, action) => {
          state.loading = false;
          if ("error" in action) {
            state.error =
              (action.error as { message?: string }).message ||
              "An error occurred";
          } else {
            state.error = "An error occurred";
          }
        }
      );
  },
});

export default contractShareSlice.reducer;
