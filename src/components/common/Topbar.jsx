import { useEffect, useState, useRef } from "react";
import { useMatches, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/Login/thunk";

const Topbar = ({ userName = "Admin", avatarUrl }) => {
  const matches = useMatches();
  const title = matches[matches.length - 1]?.handle?.title || "Dashboard";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    document.title = `Call Kaarigar – ${title}`;
  }, [title]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header
  className="h-16 flex items-center justify-between px-6
  bg-green-500 text-white shadow-md"
>
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <span className="text-xs text-blue-100">Welcome back 👋</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5 relative" ref={dropdownRef}>
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 cursor-pointer
          px-3 py-1.5 rounded-xl hover:bg-white/20 transition"
        >
          <div className="relative">
            <img
              src={
                avatarUrl ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="avatar"
              className="h-9 w-9 rounded-full object-cover border-2 border-white"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-400 border-2 border-white rounded-full"></span>
          </div>

          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium">{userName}</span>
            <span className="text-xs text-blue-100">Admin</span>
          </div>
        </div>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-0 top-14 w-48 rounded-xl
            bg-white text-black shadow-lg overflow-hidden"
          >
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              <FiUser /> Profile
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              <FiSettings /> Settings
            </button>

            <div className="border-t"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;