import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/adminAuthStore";

const AdminGuard = () => {
  const { session, isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <div className="admin-guard-loading">Checking access…</div>;
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
