import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AdminAuthContext } from "./adminAuthStore";

export const AdminAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const checkAdmin = async (nextSession) => {
      if (!nextSession) {
        if (active) setIsAdmin(false);
        return;
      }
      // A Supabase auth account alone doesn't grant access — is_admin()
      // additionally checks the session's email against public.admins.
      const { data, error } = await supabase.rpc("is_admin");
      if (active) setIsAdmin(!error && data === true);
    };

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await checkAdmin(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setLoading(true);
      await checkAdmin(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = () => supabase.auth.signOut();

  return (
    <AdminAuthContext.Provider value={{ session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
