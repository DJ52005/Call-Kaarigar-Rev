import { useEffect } from "react";
import { useMatches, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/Login/thunk";

const Topbar = ({ userName = "Admin", avatarUrl = "avatar" }) => {
  const matches = useMatches();
  const title = matches[matches.length - 1]?.handle?.title || "Admin";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = `Call Kaarigar – ${title}`;
  }, [title]);

  const handleLogout = async () => {
    const success = await dispatch(logout());
    navigate("/login", { replace: true }); // always redirect to login
  };

  return (
    <header
      className="h-14 flex items-center justify-between px-6
      bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
      shadow-sm shadow-blue-900/5 relative"
    >
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

      <div className="flex items-center gap-6 relative">
        <div className="flex items-center gap-2">
          <img
            src={
              avatarUrl ||
              "https://cdn-icons-png.flaticon.com/512/4631/4631824.png"
            }
            alt={`${userName} avatar`}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {userName}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
