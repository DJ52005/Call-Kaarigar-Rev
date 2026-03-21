import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';



export default function ProtectedRoute() {
  // You can check Redux state OR just localStorage
  const token = localStorage.getItem("token");

  // If token exists → allow access, else redirect to /login
    return true ? <Outlet /> : <Navigate to="/login" replace />
}
