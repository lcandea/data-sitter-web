import {
  configureStore,
  createAsyncThunk,
  isPending,
  isFulfilled,
  isRejected,
  ActionReducerMapBuilder,
  PayloadAction,
} from "@reduxjs/toolkit";
import valuesReducer from "./slices/values";
import contractReducer from "./slices/contract";
import validationReducer from "./slices/validation";
import loadingReducer from "./slices/loading";
import contractShareReducer from "./slices/contractShare";

export const store = configureStore({
  reducer: {
    values: valuesReducer,
    contract: contractReducer,
    contractShare: contractShareReducer,
    validation: validationReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkApiConfig = {
  state: RootState;
  dispatch: AppDispatch;
};

export function createAppAsyncThunk<ReturnType = void, ArgType = void>(
  typePrefix: string,
  payloadCreator: (
    args: ArgType,
    thunkAPI: { dispatch: AppDispatch; getState: () => RootState }
  ) => Promise<ReturnType>
) {
  return createAsyncThunk<ReturnType, ArgType, ThunkApiConfig>(
    typePrefix,
    payloadCreator
  );
}

export type WithLoadingAndError = {
  loading: boolean;
  error: string | null;
};

export const createLoadingAndErrorMatch =
  <T extends WithLoadingAndError>(sliceName: string) =>
  (builder: ActionReducerMapBuilder<T>) => {
    builder
      .addMatcher(
        (action): action is PayloadAction =>
          isPending(action) && action.type.startsWith(sliceName),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is PayloadAction =>
          isFulfilled(action) && action.type.startsWith(sliceName),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action): action is PayloadAction =>
          isRejected(action) && action.type.startsWith(sliceName),
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
  };
