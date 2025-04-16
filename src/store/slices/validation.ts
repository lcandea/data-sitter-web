import { createSlice } from "@reduxjs/toolkit";
import {
  createAppAsyncThunk,
  createLoadingAndErrorMatch,
  WithLoadingAndError,
} from "..";
import { Validation } from "data-sitter";

interface ValidationState extends WithLoadingAndError {
  validationResult: Validation[] | null;
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
    builder.addCase(executeValidator.fulfilled, (state, action) => {
      state.validationResult = action.payload;
    });
    createLoadingAndErrorMatch("validation/")(builder);
  },
});

export const { clearResults } = validationSlice.actions;
export default validationSlice.reducer;
