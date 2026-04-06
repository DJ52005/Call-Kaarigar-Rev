// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { FaUsers, FaClipboardList, FaUserCheck, FaRupeeSign } from "react-icons/fa";
import { fetchAllUsers, getAllBookings } from "../api/backend_helper";

const pieColors = ["#34d399", "#60a5fa", "#f87171", "#fbbf24", "#a78bfa", "#10b981"];

const StatCard = ({ icon: Icon, label, value, growth }) => (
  <div
    className="bg-white rounded-xl shadow-md border border-green-100 p-5 flex flex-col gap-2 w-full md:w-1/4
               transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
  >
    <div className="flex justify-between items-center">
      <div className="text-sm font-medium text-gray-600">{label}</div>
      <div className="text-orange-500 bg-orange-50 p-2 rounded-lg shadow-inner">
        <Icon className="text-xl" />
      </div>
    </div>
    <div className="text-2xl font-semibold text-gray-800">{value}</div>
    {growth !== undefined && (
      <div className={`text-sm ${growth >= 0 ? "text-green-500" : "text-red-500"}`}>
        {growth >= 0 ? `+${growth}%` : `${growth}%`} this week
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetchAllUsers();
        const userArray =
          Array.isArray(usersRes)
            ? usersRes
            : usersRes?.users
            ? usersRes.users
            : usersRes?.data?.users
            ? usersRes.data.users
            : usersRes?.data || [];

        setUsers(userArray);

        const bookingsRes = await getAllBookings();
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  // ---- Stats ----
  const totalCustomers = users.filter((u) => u.role === "customer").length;
  const activeProviders = users.filter((u) => u.role === "worker" && u.status === "active").length;
  const totalOrders = bookings.length;
  const revenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  // ---- Pie Data ----
  const serviceCounts = bookings.reduce((acc, b) => {
    const service = b.serviceName || "Others";
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(serviceCounts).map(([name, value]) => ({ name, value }));

  // ---- Bar Data ----
  const cityCounts = bookings.reduce((acc, b) => {
    const city = b.city || "Unknown";
    if (!acc[city]) acc[city] = { Completed: 0, Pending: 0, InProgress: 0 };
    acc[city][b.status] = (acc[city][b.status] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(cityCounts).map(([city, counts]) => ({
    city,
    Completed: counts.Completed || 0,
    Pending: counts.Pending || 0,
    InProgress: counts.InProgress || 0,
  }));

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 via-green-50 to-white min-h-screen">
      {/* Header Row with Title + Export */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
  className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium px-5 py-2 rounded-lg shadow-md
             transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
>
  Export CSV
</button>

      </div>

      {/* Header Cards */}
      <div className="flex flex-nowrap gap-4">
        <StatCard icon={FaUsers} label="Total Customers" value={totalCustomers} />
        <StatCard icon={FaUserCheck} label="Active Providers" value={activeProviders} />
        <StatCard icon={FaClipboardList} label="Total Orders" value={totalOrders} />
        <StatCard icon={FaRupeeSign} label="Revenue" value={`₹${revenue}`} />
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div
          className="bg-white p-4 rounded-xl shadow-md border border-green-100 
                     transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Service Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                    stroke="#f0fdf4"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div
          className="bg-white p-4 rounded-xl shadow-md border border-green-100 
                     transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-700">City-wise Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Completed" fill="#34d399" />
              <Bar dataKey="InProgress" fill="#60a5fa" />
              <Bar dataKey="Pending" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
