import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkersWithDetails,
  deleteWorkerProfile,
  updateWorkerProfile,
  verifyWorkerDocument,
} from "../slices/Provider/thunk";
import { normalizeWorkerId } from "../utils/normalizeWorkerId";

const Service2 = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.provider.list);
  const loading = useSelector((state) => state.provider.loading);
  const error = useSelector((state) => state.provider.error);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerStatus, setWorkerStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFor, setEditFor] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    dispatch(fetchWorkersWithDetails());
  }, [dispatch]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{String(error)}</p>;

  const handleVerifyWorker = (worker, status) => {
    const workerId = normalizeWorkerId(worker);
    if (!worker?.documents?.length) {
      window.alert("This worker has no documents to verify.");
      return;
    }
    const docId = worker.documents[0]?.id || worker.documents[0]?._id;
    if (!docId) {
      window.alert("Document ID missing.");
      return;
    }
    dispatch(verifyWorkerDocument({ docId, status }));
    setWorkerStatus((prev) => ({ ...prev, [workerId]: status }));
    setSelectedWorker(null);
  };

  const openEdit = (worker) => {
    setEditFor(worker);
    setFormData({
      name: worker?.name || worker?.fullName || "",
      email: worker?.email || "",
      phone: worker?.phone || worker?.mobile || "",
    });
    setEditModalOpen(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const workerId = normalizeWorkerId(editFor);
    if (!workerId) return;
    try {
      await dispatch(updateWorkerProfile({ workerId, data: formData })).unwrap();
      await dispatch(fetchWorkersWithDetails());
      setEditModalOpen(false);
      setEditFor(null);
    } catch (err) {
      console.error("Update failed:", err);
      window.alert("Update failed. See console for details.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "text-green-600 font-semibold";
      case "rejected": return "text-red-600 font-semibold";
      case "blocked": return "text-gray-600 font-semibold";
      default: return "text-yellow-600 font-semibold";
    }
  };

  const filteredWorkers = list.filter((worker) => {
    const workerId = normalizeWorkerId(worker);
    const status = workerStatus[workerId] || "pending";

    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (worker?.name || worker?.fullName || "").toLowerCase().includes(q) ||
      (worker?.email || "").toLowerCase().includes(q) ||
      (worker?.phone || worker?.mobile || "").toLowerCase().includes(q);

    const matchesStatus = statusFilter === "All" || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Workers Management</h2>
        <button
          onClick={() => {
            if (!list.length) return;
            const headers = ["ID","Name","Email","Phone","Status","Skills","Experience","Services","Documents"];
            const rows = list.map((w) => [
              normalizeWorkerId(w),
              w.name || w.fullName || "",
              w.email || "",
              w.phone || w.mobile || "",
              workerStatus[normalizeWorkerId(w)] || "pending",
              (w.profile?.skills || []).join(", "),
              w.profile?.experienceYears ?? "",
              (w.services || []).map((s) => s.serviceName || "").join(", "),
              (w.documents || []).map((d) => d.type || "").join(", ")
            ]);
            const csvContent = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.setAttribute("download", "workers.csv");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="px-5 py-2 bg-green-400 text-white rounded-lg"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-lg flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option>All</option>
          <option>Accepted</option>
          <option>Pending</option>
          <option>Rejected</option>
          <option>Blocked</option>
        </select>
      </div>

      {/* Workers Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-green-200 text-gray-700 text-xs uppercase sticky top-0">
            <tr>
              <th className="px-3 py-3 text-left">Name</th>
              <th className="px-3 py-3 text-left">Email</th>
              <th className="px-3 py-3 text-left">Phone</th>
              <th className="px-3 py-3 text-left">Status</th>
              <th className="px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.map((worker, idx) => {
              const workerId = normalizeWorkerId(worker);
              const status = workerStatus[workerId] || "pending";
              return (
                <tr key={workerId || idx} className={idx%2===0?"bg-white":"bg-green-50"}>
                  <td className="px-4 py-3">{worker?.name || worker?.fullName || "—"}</td>
                  <td className="px-4 py-3">{worker?.email || "—"}</td>
                  <td className="px-4 py-3">{worker?.phone || worker?.mobile || "N/A"}</td>
                  <td className={`px-4 py-3 ${getStatusColor(status)}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</td>
                  <td className="px-4 py-3 text-center flex gap-2 justify-center">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                      onClick={() => handleVerifyWorker(worker, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-lg"
                      onClick={() => handleVerifyWorker(worker, "rejected")}
                    >
                      Reject
                    </button>
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg"
                      onClick={() => openEdit(worker)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmitEdit}
            className="bg-white p-6 rounded-2xl shadow-lg w-96"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Worker</h3>
            <input
              className="w-full border rounded-lg p-2 mb-3"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              className="w-full border rounded-lg p-2 mb-3"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              className="w-full border rounded-lg p-2 mb-3"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Service2;
