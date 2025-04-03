import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "..";
import { Validation } from "data-sitter";

interface ValidationState {
  validationResult: Validation[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: ValidationState = {
  validationResult: null,
  loading: false,
  error: null,
};

export const executeValidator = createAppAsyncThunk(
  "validation/executeValidator",
  async (validator: () => Promise<Validation[]>) => {
    return await validator();
  }
);

const validationSlice = createSlice({
  name: "validation",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.validationResult = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeValidator.fulfilled, (state, action) => {
        state.validationResult = action.payload;
      })
      .addMatcher(
        (action): action is PayloadAction =>
          isPending(action) && action.type.startsWith("validation/"),
        (state) => {
          state.validationResult = null;
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is PayloadAction =>
          isFulfilled(action) && action.type.startsWith("validation/"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action): action is ReturnType<typeof isRejected> =>
          isRejected(action) && action.type.startsWith("validation/"),
        (state, action) => {
          state.loading = false;
          if ("error" in action) {
            state.error =
              (action.error as { message?: string }).message ||
              "An error occurred in validation";
          } else {
            state.error = "An error occurred in validation";
          }
        }
      );
  },
});

export const { clearResults } = validationSlice.actions;
export default validationSlice.reducer;
