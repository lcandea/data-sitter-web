import {
  isPending,
  isFulfilled,
  isRejected,
  ActionReducerMapBuilder,
  PayloadAction,
} from "@reduxjs/toolkit";

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
