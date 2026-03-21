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

  const { complaints = [], stats = {}, selectedComplaint, loading, error } =
    useSelector((state) => state.support || {});

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    dispatch(fetchComplaints());
    dispatch(fetchStats());
  }, [dispatch]);

  const renderError = (err) => {
    if (!err) return null;
    if (typeof err === "string") return err;
    if (err.message) return err.message;
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const exportCSV = () => {
    const header = [
      "ID",
      "Customer",
      "Issue",
      "Description",
      "Phone",
      "Status",
      "Date",
    ];
    const rows = filteredComplaints.map((c) => [
      c.id,
      c.customer ?? "",
      c.issue ?? "",
      c.description ?? "",
      c.phone ?? "",
      c.status ?? "",
      c.date ?? "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((r) => r.map(String).join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "support_tickets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredComplaints = (Array.isArray(complaints) ? complaints : []).filter(
    (c) => {
      const matchesStatus =
        statusFilter === "All" ? true : (c.status ?? "") === statusFilter;
      const q = (search ?? "").toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        (String(c.customer ?? "").toLowerCase().includes(q) ||
          String(c.issue ?? "").toLowerCase().includes(q));
      const matchesDate =
        (!dateFrom || !c.date || new Date(c.date) >= new Date(dateFrom)) &&
        (!dateTo || !c.date || new Date(c.date) <= new Date(dateTo));
      return matchesStatus && matchesSearch && matchesDate;
    }
  );

  const openDetails = (id) => {
    if (!id) return;
    dispatch(fetchComplaintById(id));
  };

  const closeDetails = () => {
    dispatch(clearSelectedComplaint());
  };

  const handleToggleStatus = (id, currentStatus) => {
    if (!id) return;
    dispatch(toggleComplaintStatus({ id, currentStatus }));
  };

  const totalCount = Number(stats?.total) || 0;
  const pendingCount = Number(stats?.pending) || 0;
  const resolvedCount = Number(stats?.resolved) || 0;

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-green-50 to-green-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl font-bold text-gray-900">Support / Complaints</h2>
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition shadow"
        >
          Export CSV
        </button>
      </div>
      <p className="text-gray-600 mb-6">
        Track and resolve customer support issues efficiently
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Complaints" value={totalCount} color="text-green-600" />
        <StatCard label="Pending" value={pendingCount} color="text-orange-500" />
        <StatCard label="Resolved" value={resolvedCount} color="text-green-600" />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-md transition hover:shadow-lg mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by customer or issue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3 focus:ring-2 focus:ring-green-200"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-40 focus:ring-2 focus:ring-green-200"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-200"
          />
          <span className="text-gray-600">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-200"
          />
        </div>
      </div>

      {/* Complaints List */}
      <div>
        {loading && (
          <p className="text-center py-6 text-gray-500">Loading complaints...</p>
        )}
        {!loading && error && (
          <p className="text-center py-4 text-red-600">{renderError(error)}</p>
        )}

        {!loading && !error && (
          <>
            {Array.isArray(filteredComplaints) && filteredComplaints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComplaints.map((c) => (
                  <div
                    key={String(c.id)}
                    className="bg-white rounded-2xl shadow-md p-5 transition hover:scale-105 hover:shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">
                        {c.issue ?? "No issue title"}
                      </h3>
                      <p className="text-gray-700 mb-2">
                        {c.description ?? "No description"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Customer:</span>{" "}
                        {c.customer ?? "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span>{" "}
                        <a
                          href={`tel:${c.phone ?? ""}`}
                          className="text-blue-600 hover:underline"
                        >
                          {c.phone ?? "-"}
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Date:</span>{" "}
                        {c.date ?? "-"}
                      </p>
                      <span
                        className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                          (c.status ?? "").toLowerCase() === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {c.status ?? "Unknown"}
                      </span>
                    </div>
                    <div className="flex gap-2 justify-end mt-4">
                      {String((c.status ?? "").toLowerCase()) !== "resolved" && (
                        <button
                          onClick={() =>
                            handleToggleStatus(c.id, c.status ?? "Pending")
                          }
                          className="px-3 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => openDetails(c.id)}
                        className="px-3 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">
                No complaints found.
              </p>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedComplaint && typeof selectedComplaint === "object" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={closeDetails}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Complaint Details
            </h3>
            <p className="mb-2">
              <strong>Customer:</strong> {selectedComplaint.customer ?? "-"}
            </p>
            <p className="mb-2">
              <strong>Issue:</strong> {selectedComplaint.issue ?? "-"}
            </p>
            <p className="mb-3">
              <strong>Description:</strong> {selectedComplaint.description ?? "-"}
            </p>
            <p className="mb-2">
              <strong>Phone:</strong>{" "}
              <a
                href={`tel:${selectedComplaint.phone ?? ""}`}
                className="text-blue-600 hover:underline"
              >
                {selectedComplaint.phone ?? "-"}
              </a>
            </p>
            <p className="mb-2">
              <strong>Date:</strong> {selectedComplaint.date ?? "-"}
            </p>
            <p
              className={`mb-4 font-medium ${
                (selectedComplaint.status ?? "").toLowerCase() === "pending"
                  ? "text-orange-500"
                  : "text-green-600"
              }`}
            >
              Status: {selectedComplaint.status ?? "-"}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  handleToggleStatus(
                    selectedComplaint.id,
                    selectedComplaint.status
                  )
                }
                className={`px-3 py-2 rounded text-white ${
                  (selectedComplaint.status ?? "").toLowerCase() === "pending"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {(selectedComplaint.status ?? "").toLowerCase() === "pending"
                  ? "Mark Resolved"
                  : "Reopen"}
              </button>
              <a
                href={`tel:${selectedComplaint.phone ?? ""}`}
                className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Call
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg">
      <h4 className="text-gray-500 font-medium">{label}</h4>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
