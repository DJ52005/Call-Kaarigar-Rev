// src/pages/Transactions.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../slices/Transactions/thunk";

export default function Transactions() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Stats calculations
  const totalPayments = items.length;
  const pendingPayments = items.filter(t => t.status === "pending").length;
  const completedPayments = items.filter(t => t.status === "completed").length;
  const totalRevenue = items.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Transactions</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-lg rounded-xl p-4 text-center transform hover:scale-105 hover:shadow-xl transition duration-200">
          <h3 className="text-sm text-gray-500">Total Payments</h3>
          <p className="text-2xl font-bold text-gray-700">{totalPayments}</p>
        </div>
        <div className="bg-yellow-100 shadow-lg rounded-xl p-4 text-center transform hover:scale-105 hover:shadow-xl transition duration-200">
          <h3 className="text-sm text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-yellow-700">{pendingPayments}</p>
        </div>
        <div className="bg-green-100 shadow-lg rounded-xl p-4 text-center transform hover:scale-105 hover:shadow-xl transition duration-200">
          <h3 className="text-sm text-gray-500">Completed</h3>
          <p className="text-2xl font-bold text-green-700">{completedPayments}</p>
        </div>
        <div className="bg-blue-100 shadow-lg rounded-xl p-4 text-center transform hover:scale-105 hover:shadow-xl transition duration-200">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-700">
            ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-xl shadow-lg bg-white">
        <table className="w-full text-sm text-gray-700 border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-green-200 to-blue-200 text-gray-700 text-xs uppercase">
              <th className="px-3 py-3 text-left">Customer</th>
              <th className="px-3 py-3 text-left">Worker</th>
              <th className="px-3 py-3 text-left">Amount</th>
              <th className="px-3 py-3 text-left">Payment Method</th>
              <th className="px-3 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items && items.length > 0 ? (
              items.map((t, index) => (
                <tr
                  key={t._id}
                  className={`hover:scale-[1.01] hover:shadow-md transition-all duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <td className="px-3 py-3">{t.customerId?.name || "N/A"}</td>
                  <td className="px-3 py-3">{t.workerId?.name || "N/A"}</td>
                  <td className="px-3 py-3 font-semibold text-indigo-700">
                    ₹{Number(t.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3">{t.paymentMethod || "N/A"}</td>
                  <td className="px-3 py-3 capitalize">{t.status || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-gray-500 text-center">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
