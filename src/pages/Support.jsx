// src/pages/Support.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchComplaints,
  fetchStats,
  fetchComplaintById,
  toggleComplaintStatus,
} from "../slices/Support/thunk";

import { clearSelectedComplaint } from "../slices/Support/reducer";

export default function Support() {
  const dispatch = useDispatch();

  const {
    complaints = [],
    stats = {},
    selectedComplaint,
    loading,
    error,
  } = useSelector((state) => state.support || {});

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchComplaints());
    dispatch(fetchStats());
  }, [dispatch]);

  // FILTER
  const filteredComplaints = complaints.filter((c) => {
    const matchStatus =
      statusFilter === "All" ? true : c.status === statusFilter;

    const q = search.toLowerCase();
    const matchSearch =
      c.customer.toLowerCase().includes(q) ||
      c.issue.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  const handleToggleStatus = (id, status) => {
    dispatch(toggleComplaintStatus({ id, currentStatus: status }));
  };

  const openDetails = (id) => dispatch(fetchComplaintById(id));
  const closeDetails = () => dispatch(clearSelectedComplaint());

  const exportCSV = () => {
    const rows = filteredComplaints.map((c) => [
      c.id,
      c.customer,
      c.issue,
      c.phone,
      c.status,
      c.date,
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [["ID", "Customer", "Issue", "Phone", "Status", "Date"], ...rows]
        .map((r) => r.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "complaints.csv";
    link.click();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Support / Complaints</h2>

        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">
        <input
          placeholder="Search..."
          className="border px-3 py-2 rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Resolved</option>
        </select>
      </div>

      {/* TABLE (MATCHES CUSTOMER STYLE) */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Issue</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No complaints found
                </td>
              </tr>
            ) : (
              filteredComplaints.map((c, i) => (
                <tr
                  key={c.id}
                  className={`border-t ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{c.customer}</td>
                  <td className="px-4 py-3">{c.issue}</td>
                  <td className="px-4 py-3">{c.phone}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        c.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">{c.date}</td>

                  <td className="px-4 py-3 flex gap-2 justify-center">
                    {c.status !== "Resolved" && (
                      <button
                        onClick={() =>
                          handleToggleStatus(c.id, c.status)
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Resolve
                      </button>
                    )}

                    <button
                      onClick={() => openDetails(c.id)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 relative">
            <button
              onClick={closeDetails}
              className="absolute top-2 right-2"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold mb-2">Complaint Details</h3>

            <p><b>Customer:</b> {selectedComplaint.customer}</p>
            <p><b>Issue:</b> {selectedComplaint.issue}</p>
            <p><b>Description:</b> {selectedComplaint.description}</p>
            <p><b>Phone:</b> {selectedComplaint.phone}</p>
            <p><b>Date:</b> {selectedComplaint.date}</p>
            <p><b>Status:</b> {selectedComplaint.status}</p>

            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() =>
                  handleToggleStatus(
                    selectedComplaint.id,
                    selectedComplaint.status
                  )
                }
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Toggle Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}