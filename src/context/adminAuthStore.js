import { createContext, useContext } from "react";

// Split out of AdminAuthContext.jsx so that file can export the
// AdminAuthProvider component only — react-refresh/only-export-components
// requires a component file not export anything else (a hook included).
export const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
};
