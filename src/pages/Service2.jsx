import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkersWithDetails,
  verifyWorkerDocument,
} from "../slices/Provider/thunk";

const Service2 = () => {
  const dispatch = useDispatch();

  const list = useSelector((state) => state.provider.list);
  const loading = useSelector((state) => state.provider.loading);
  const error = useSelector((state) => state.provider.error);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDocs, setSelectedDocs] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    dispatch(fetchWorkersWithDetails());
  }, [dispatch]);

  // ================= DEBUG =================
  useEffect(() => {
    console.log("🔥 WORKER LIST FULL:");

    list.forEach((worker, i) => {
      console.log(`👷 Worker ${i + 1}:`, worker);
      console.log("👉 worker._id (FINAL):", worker._id);

      if (worker.documents?.length) {
        console.log("✅ Documents:", worker.documents);
      } else {
        console.log("⚠️ No documents");
      }
    });
  }, [list]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{String(error)}</p>;

  // ================= SAFE ACCESS =================
  const getEmail = (worker) => worker?.email || "";
  const getPhone = (worker) =>
    worker?.phone || worker?.phoneNumber || "";

  // ================= STATUS =================
  const getWorkerStatus = (worker) => {
    const doc = worker?.documents?.[0];
    return doc?.status || "pending";
  };

  // ================= VERIFY =================
  const handleVerifyWorker = (worker, status) => {
  const doc = worker?.documents?.[0];

  if (!doc?._id) {
    console.warn("❌ No document found for worker:", worker._id);
    return;
  }

  console.log("🚀 Verifying docId:", doc._id);

  dispatch(verifyWorkerDocument({ docId: doc._id, status }))
    .unwrap()
    .then(() => {
      dispatch(fetchWorkersWithDetails()); // 🔥 refresh list
    })
    .catch((err) => {
      console.error("❌ Verify failed:", err);
    });
};

  // ================= FILTER =================
  const filteredWorkers = list.filter((worker) => {
    const status = getWorkerStatus(worker);
    const q = searchTerm.trim().toLowerCase();

    return (
      (!q ||
        worker.email?.toLowerCase().includes(q) ||
        getPhone(worker).includes(q)) &&
      (statusFilter === "All" ||
        status === statusFilter.toLowerCase())
    );
  });

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Workers Management
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by email, phone..."
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
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gradient-to-r from-green-200 to-blue-200 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredWorkers.map((worker, idx) => {
              const workerId = worker._id;
              const status = getWorkerStatus(worker);

              return (
                <tr
                  key={workerId || idx}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-6 py-4">
                    {getEmail(worker) || "—"}
                  </td>

                  <td className="px-6 py-4">
                    {getPhone(worker) || "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        handleVerifyWorker(worker, "verified")
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleVerifyWorker(worker, "rejected")
                      }
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        setSelectedDocs(worker.documents?.[0])
                      }
                      className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {selectedDocs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-2xl shadow-lg relative">

            <button
              onClick={() => setSelectedDocs(null)}
              className="absolute top-2 right-3 text-xl font-bold text-gray-600"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Worker Documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {selectedDocs?.aadhar?.url && (
                <div>
                  <p className="font-medium mb-1">Aadhar</p>
                  <a href={selectedDocs.aadhar.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={selectedDocs.aadhar.url}
                      alt="Aadhar"
                      className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
                    />
                  </a>
                </div>
              )}

              {selectedDocs?.pan?.url && (
                <div>
                  <p className="font-medium mb-1">PAN</p>
                  <a href={selectedDocs.pan.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={selectedDocs.pan.url}
                      alt="PAN"
                      className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
                    />
                  </a>
                </div>
              )}

              {selectedDocs?.policeVerification?.url && (
                <div>
                  <p className="font-medium mb-1">Police Verification</p>
                  <a href={selectedDocs.policeVerification.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={selectedDocs.policeVerification.url}
                      alt="Police"
                      className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
                    />
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service2;