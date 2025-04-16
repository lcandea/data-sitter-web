import { useEffect } from "react";
import { supabase } from "@/services/supabase/supabase";
import { useAppDispatch } from "@/hooks/useStore";
import { setSession } from "./slices/auth";

export const AuthListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        dispatch(setSession(null));
        [window.localStorage, window.sessionStorage].forEach((storage) => {
          Object.keys(storage).forEach((key) => storage.removeItem(key));
        });
      } else if (session) {
        dispatch(setSession(session));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return null;
};
