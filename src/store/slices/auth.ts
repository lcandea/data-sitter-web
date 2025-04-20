// store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";
import { createAppAsyncThunk } from "..";
import { supabase } from "@/services/supabase/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
}

const initialState: AuthState = {
  session: null,
  user: null,
};

export const logout = createAppAsyncThunk("auth/logout", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.session = null;
      state.user = null;
    });
  },
});

export const { setSession } = authSlice.actions;
export default authSlice.reducer;
