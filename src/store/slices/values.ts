import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContractValue } from "@/lib/types";

interface ValuesState {
  values: ContractValue[];
}

const initialState: ValuesState = {
  values: [],
};

const valuesSlice = createSlice({
  name: "values",
  initialState,
  reducers: {
    setValues: (state, action: PayloadAction<ContractValue[]>) => {
      state.values = action.payload;
    },
    addValue: (state, action: PayloadAction<ContractValue>) => {
      // Check if name already exists
      if (state.values.some((value) => value.name === action.payload.name)) {
        return;
      }
      state.values.push(action.payload);
    },
    updateValue: (state, action: PayloadAction<ContractValue>) => {
      const index = state.values.findIndex(
        (value) => value.name === action.payload.name
      );
      if (index !== -1) {
        state.values[index] = action.payload;
      }
    },
    removeValue: (state, action: PayloadAction<string>) => {
      state.values = state.values.filter(
        (value) => value.name !== action.payload
      );
    },
    clearValues: (state) => {
      state.values = [];
    },
  },
});

export const { setValues, addValue, updateValue, removeValue, clearValues } =
  valuesSlice.actions;
export default valuesSlice.reducer;
