import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Topbar from "../common/Topbar";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen bg-[#FAFAFA] flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main section */}
      <main className="flex-1 overflow-hidden transition-all duration-300">
        {/* Fixed Topbar */}
        <div className="sticky top-0 z-30 bg-[#FAFAFA] shadow-sm">
          <Topbar />
        </div>

        {/* Scrollable content area */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto p-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
