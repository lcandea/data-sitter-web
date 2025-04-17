import { useEffect } from "react";
import { supabase } from "@/services/supabase/supabase";
import { useAppDispatch } from "@/hooks/useStore";
import { setSession } from "./slices/auth";
import { useNavigate } from "react-router-dom";
import { resetContractState } from "./slices/contract";
import { clearValues } from "./slices/values";
import { clearResults } from "./slices/validation";

export const AuthListener = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        dispatch(setSession(null));
        dispatch(resetContractState());
        dispatch(resetContractState());
        dispatch(clearResults());
        dispatch(clearValues());
        [window.localStorage, window.sessionStorage].forEach((storage) => {
          Object.keys(storage).forEach((key) => storage.removeItem(key));
        });
        navigate("/");
      } else if (session) {
        dispatch(setSession(session));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, navigate]);

  return null;
};
