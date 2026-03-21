import Layout from "./components/layout/Layout";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound.jsx";
import Orders from "./pages/Orders.jsx";
import Customers from "./pages/Customers.jsx";
import Services from "./pages/Services.jsx";
import Categories from "./pages/Categories.jsx";
import Notifications from "./pages/Notifications.jsx";
import Settings from "./pages/Settings";
import Service2 from "./pages/Service2";
import Transactions from "./pages/Transactions.jsx";
import ReviewRatings from "./pages/ReviewRatings.jsx";
import Support from "./pages/Support.jsx";
// import Profile from "./pages/Profile";

import { Navigate } from "react-router-dom";

// ✅ Routes configuration
export const routes = [
  // 🔓 Public route for login
  {
    path: "/login",
    element: <PublicRoute />, // wrapper
    children: [
      { index: true, element: <Login />, handle: { title: "Login" } },
    ],
  },

  // 🔀 Redirect root → login
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // 🔒 Protected dashboard routes
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard />, handle: { title: "Dashboard" } },
          { path: "orders", element: <Orders />, handle: { title: "Orders" } },
          // { path: "profile", element: <Profile />, handle: { title: "Profile" } },
          { path: "customers", element: <Customers />, handle: { title: "Customers" } },
          { path: "services", element: <Services />, handle: { title: "Services" } },
          { path: "categories", element: <Categories />, handle: { title: "Categories" } },
          { path: "service2", element: <Service2 />, handle: { title: "Service Provider" } },
          { path: "notifications", element: <Notifications />, handle: { title: "Notifications" } },
          { path: "settings", element: <Settings />, handle: { title: "Settings" } },
          { path: "transaction", element: <Transactions />, handle: { title: "Transactions" } },
          { path: "reviewRatings", element: <ReviewRatings />, handle: { title: "Reviews/Ratings" } },
          { path: "support", element: <Support />, handle: { title: "Support" } },
          { path: "*", element: <NotFound />, handle: { title: "Not Found" } },
        ],
      },
    ],
  },

  // ❌ Catch-all
  {
    path: "*",
    element: <NotFound />,
  },
];
