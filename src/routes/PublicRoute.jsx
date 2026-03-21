import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("token");

  // If already logged in, block login page → go dashboard
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
