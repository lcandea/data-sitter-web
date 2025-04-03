import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Contract, ContractField } from "@/lib/types";
import { createAppAsyncThunk } from "..";

interface ContractState {
  id: string | null;
  name: string | null;
  fields: ContractField[];
  loading: boolean;
  error: string | null;
}

const initialState: ContractState = {
  id: null,
  name: null,
  fields: [],
  loading: false,
  error: null,
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export const fetchConctract = createAppAsyncThunk(
  "contract/fetchConctract",
  async (id: string) => {
    console.log("contract/fetchConctract id:", id);
    await new Promise((resolve) => setTimeout(resolve, 300));

    return null;
  }
);

export const createConctract = createAppAsyncThunk(
  "contract/createConctract",
  async (_, { getState }) => {
    const { name, fields } = getState().contract;
    if (!name) throw Error("Contract name cannot be empty or null.");
    const { values } = getState().values;
    const updatedContract: Contract = { id: null, name, fields, values };
    console.log("contract/createConctract id:", updatedContract);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateId();
  }
);

export const updateConctract = createAppAsyncThunk(
  "contract/updateConctract",
  async (id: string, { getState }) => {
    const { id: storedId, name, fields } = getState().contract;
    if (id != storedId) throw Error("IDs does not match when trying to update");
    if (!name) throw Error("Contract name cannot be empty or null.");
    const { values } = getState().values;
    const updatedContract: Contract = { id, name, fields, values };
    console.log("contract/updateConctract id:", id, updatedContract);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return 204;
  }
);

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConctract.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, name, fields } = action.payload;
          state.id = id || null;
          state.name = name || null;
          state.fields = fields;
        }
      })
      .addCase(createConctract.fulfilled, (state, action) => {
        const id = action.payload;
        state.id = id;
      })
      .addCase(updateConctract.fulfilled, (state, action) => {
        const status = action.payload;
        if (status != 204) {
          state.error = "Update Contract did not return 204";
        }
      })
      .addMatcher(
        (action): action is PayloadAction =>
          isPending(action) && action.type.startsWith("contract/"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is PayloadAction =>
          isFulfilled(action) && action.type.startsWith("contract/"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action): action is ReturnType<typeof isRejected> =>
          isRejected(action) && action.type.startsWith("contract/"),
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
export const { setName, setFields, setContract } = contractSlice.actions;

export default contractSlice.reducer;
