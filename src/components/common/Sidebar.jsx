import { NavLink } from "react-router-dom";
import { MdDashboard, MdStarRate } from "react-icons/md";
import {
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaHandsWash,
  FaBell,
  FaExchangeAlt,
  FaHeadset,
  FaTools,
} from "react-icons/fa";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

const navItems = [
  { to: "", label: "Dashboard", Icon: MdDashboard, end: true },
  { to: "orders", label: "Bookings", Icon: FaShoppingCart },
  { to: "customers", label: "Customers", Icon: FaUsers },
  { to: "services", label: "Services", Icon: FaHandsWash },
    { to: "categories", label: "Categories", Icon: FaHandsWash },
  { to: "service2", label: "Service Provider", Icon: FaHandsWash },
  { to: "notifications", label: "Notifications", Icon: FaBell },
  { to: "transaction", label: "Transactions", Icon: FaExchangeAlt },
  { to: "reviewRatings", label: "Reviews & Ratings", Icon: MdStarRate },
  { to: "support", label: "Support", Icon: FaHeadset },
  { to: "settings", label: "Settings", Icon: FaCog },
];

const Sidebar = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={`h-screen p-4 flex flex-col justify-between 
      bg-gradient-to-br from-green-50 via-green-50 to-green-100
      border-r border-gray-200 shadow-md transition-all duration-300
      ${collapsed ? "w-20" : "w-60"}`}
    >
      <div>
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6 transition-all duration-300">
          <div className="flex items-center gap-2">
            <FaTools size={collapsed ? 28 : 36} className="text-green-700" />
            {!collapsed && (
              <h2 className="font-bold text-lg text-gray-800 tracking-wide">
                Call Kaarigar Admin
              </h2>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="space-y-2">
          {navItems.map(({ to, Icon, label, end }) => (
            <li key={label} title={collapsed ? label : undefined}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-green-100 text-green-700 font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-green-50 hover:shadow-md hover:scale-[1.02]"
                  }
                  ${collapsed ? "justify-center px-0" : ""}`
                }
              >
                <Icon size={18} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center p-2 rounded-lg 
        bg-white border border-gray-300 shadow hover:shadow-md hover:scale-110 
        transition-all duration-200"
      >
        {collapsed ? <LuPanelLeftOpen size={20} /> : <LuPanelLeftClose size={20} />}
      </button>
    </aside>
  );
};

export default Sidebar;
