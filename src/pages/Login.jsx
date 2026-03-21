import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../pages/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/Login/thunk";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.login);

  const [form, setForm] = useState({ identifier: "9999911111", password: "password123" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await dispatch(login(form));

    if (success) {
      navigate("/dashboard"); // ✅ lowercase path matches routes
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200"
      >
        <div className="p-6 text-center">
          <img src={logo} alt="Karigar Logo" className="mx-auto w-16 mb-2" />
          <h2 className="text-xl font-bold text-red-800">Admin</h2>
          <p className="text-sm text-gray-600 font-medium">Admin Login</p>
        </div>

        <div className="px-6 pb-6">
          {/* Email */}
          <div className="relative mb-4">
            <FaUser className="absolute top-3 left-3 text-orange-400" />
            <input
              type="text"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              className="pl-10 pr-3 py-2 w-full border border-orange-400 rounded-md text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="relative mb-4">
            <FaLock className="absolute top-3 left-3 text-orange-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="pl-10 pr-10 py-2 w-full border border-orange-400 rounded-md text-sm 
                [&::-ms-reveal]:hidden [&::-ms-clear]:hidden 
                [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-clear-button]:hidden"
              required
            />
            <span
              className="absolute top-3 right-3 cursor-pointer text-orange-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md shadow"
            disabled={loading}
          >
            {loading ? "Logging in..." : "➔ Login to Dashboard"}
          </button>
        </div>
      </form>
    </div>
  );
}
