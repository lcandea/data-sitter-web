import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import valuesReducer from "./slices/values";
import contractReducer from "./slices/contract";
import validationReducer from "./slices/validation";

export const store = configureStore({
  reducer: {
    values: valuesReducer,
    contract: contractReducer,
    validation: validationReducer,
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
