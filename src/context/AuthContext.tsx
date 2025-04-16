import React, { createContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase/supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const fetchSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Error fetching session:", error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

        switch (event) {
          case "SIGNED_IN":
            console.log("user signed in", session?.user || null);
            break;
          case "SIGNED_OUT":
            console.log("user signed out");
            break;
          default:
            console.log("auth event:", event);
            break;
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    session,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
