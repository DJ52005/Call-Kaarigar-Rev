import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomersThunk,
  addCustomerThunk,
  updateCustomerThunk,
  deleteCustomerThunk,
} from "../slices/Customer/thunk";
import {
  setSelectedCustomer,
  clearSelectedCustomer,
} from "../slices/Customer/reducer";

export default function Customers() {
  const dispatch = useDispatch();
  const { list: customers, loading, error, selectedCustomer } = useSelector(
    (state) => state.customers
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [addingCustomer, setAddingCustomer] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "inactive",
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const initialCustomer = {
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "inactive",
  };

  // 🔹 Auto refresh every 10s
  useEffect(() => {
    dispatch(fetchCustomersThunk());
    const interval = setInterval(() => {
      dispatch(fetchCustomersThunk());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // ✅ Add Customer
  const handleAdd = async () => {
    setFormError("");
    setFormSuccess("");

    if (!newCustomer.name || !newCustomer.email || !newCustomer.password) {
      setFormError("Name, email and password are required!");
      return;
    }

    try {
      const resultAction = await dispatch(addCustomerThunk(newCustomer));
      if (addCustomerThunk.rejected.match(resultAction)) {
        setFormError(resultAction.payload || "Failed to add customer");
      } else {
        setFormSuccess("Customer registered successfully!");
        dispatch(fetchCustomersThunk());
        setAddingCustomer(false);
      }
    } catch {
      setFormError("Unexpected error. Please try again.");
    }
  };

  // ✅ Edit
  const handleEdit = (customer) => {
    setEditingCustomer({ ...customer });
  };

  // ✅ Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteCustomerThunk(id));
      dispatch(fetchCustomersThunk());
    }
  };

  // 🔍 Filter
  const filteredCustomers = customers.filter((c) =>
    [c.name, c.email, c.phone]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // 📊 Stats
  const total = customers.length;
  const active = customers.filter((c) => c.status === "active").length;
  const inactive = customers.filter((c) => c.status === "inactive").length;

  // ✅ Export CSV
  const handleExportCSV = () => {
    if (!customers.length) return;

    const headers = ["Name", "Email", "Phone", "Status"];
    const rows = customers.map((c) => [
      c.name,
      c.email,
      c.phone,
      c.status || "inactive",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell || ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 min-h-screen">
      {/* Title + Buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <button
          onClick={handleExportCSV}
          className="px-5 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
        >
          Export CSV
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center transform hover:scale-105 hover:shadow-xl transition duration-200">
          <h3 className="text-sm text-gray-500">Total Customers</h3>
          <p className="text-2xl font-bold text-gray-700">{total}</p>
        </div>
        <div className="bg-green-100 shadow-lg rounded-xl p-6 text-center transform hover:scale-105 hover:shadow-xl transition duration-200">
          <h3 className="text-sm text-gray-600">Active</h3>
          <p className="text-2xl font-bold text-green-700">{active}</p>
        </div>
        <div className="bg-red-100 shadow-lg rounded-xl p-6 text-center transform hover:scale-105 hover:shadow-xl transition duration-200">
          <h3 className="text-sm text-gray-600">Inactive</h3>
          <p className="text-2xl font-bold text-red-700">{inactive}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm w-full md:w-64 shadow-sm focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow-lg">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gradient-to-r from-green-200 to-blue-200 text-gray-700 text-xs uppercase">
              <th className="px-3 py-3 text-left">Name</th>
              <th className="px-3 py-3 text-left">Email</th>
              <th className="px-3 py-3 text-left">Phone</th>
              <th className="px-3 py-3 text-left">Status</th>
              <th className="px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentCustomers.map((c, index) => (
              <tr
                key={c.id}
                className={`hover:scale-[1.01] hover:shadow-md transition-all duration-150 ${
                  index % 2 === 0 ? "bg-white" : "bg-blue-50"
                }`}
              >
                <td className="px-3 py-3">{c.name}</td>
                <td className="px-3 py-3">{c.email}</td>
                <td className="px-3 py-3">{c.phone}</td>
                <td className="px-3 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      c.status === "active"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {c.status || "inactive"}
                  </span>
                </td>
                <td className="px-3 py-3 space-x-2 text-center">
                  <button
                    onClick={() => dispatch(setSelectedCustomer(c))}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs shadow transition hover:scale-105"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs shadow transition hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs shadow transition hover:scale-105"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-3 py-1 rounded-md border transition ${
            currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "hover:bg-green-100 hover:shadow"
          }`}
        >
          Prev
        </button>

        {Array.from(
          { length: Math.ceil(filteredCustomers.length / customersPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-md border transition ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-green-100 hover:shadow"
              }`}
            >
              {index + 1}
            </button>
          )
        )}

        <button
          disabled={
            currentPage ===
            Math.ceil(filteredCustomers.length / customersPerPage)
          }
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-3 py-1 rounded-md border transition ${
            currentPage ===
            Math.ceil(filteredCustomers.length / customersPerPage)
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "hover:bg-green-100 hover:shadow"
          }`}
        >
          Next
        </button>
      </div>

      {/* Add Modal */}
      {addingCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl animate-fadeIn">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Add Customer
            </h2>

            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3">
                {formSuccess}
              </div>
            )}

            <input
              type="text"
              placeholder="Name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              className="border w-full px-3 py-2 mb-2 rounded-md text-sm focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              className="border w-full px-3 py-2 mb-2 rounded-md text-sm focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
              className="border w-full px-3 py-2 mb-2 rounded-md text-sm focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={newCustomer.password}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, password: e.target.value })
              }
              className="border w-full px-3 py-2 mb-4 rounded-md text-sm focus:ring-2 focus:ring-green-400"
            />

            <select
              value={newCustomer.status}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, status: e.target.value })
              }
              className="border w-full px-3 py-2 mb-4 rounded-md text-sm focus:ring-2 focus:ring-green-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAddingCustomer(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm transition hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition hover:scale-105"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl animate-fadeIn">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Edit Customer
            </h2>

            <input
              type="text"
              value={editingCustomer.name}
              onChange={(e) =>
                setEditingCustomer({
                  ...editingCustomer,
                  name: e.target.value,
                })
              }
              className="border w-full px-3 py-2 mb-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Name"
            />
            <input
              type="email"
              value={editingCustomer.email}
              onChange={(e) =>
                setEditingCustomer({
                  ...editingCustomer,
                  email: e.target.value,
                })
              }
              className="border w-full px-3 py-2 mb-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Email"
            />
            <input
              type="text"
              value={editingCustomer.phone}
              onChange={(e) =>
                setEditingCustomer({
                  ...editingCustomer,
                  phone: e.target.value,
                })
              }
              className="border w-full px-3 py-2 mb-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Phone"
            />
            <select
              value={editingCustomer.status || "inactive"}
              onChange={(e) =>
                setEditingCustomer({
                  ...editingCustomer,
                  status: e.target.value,
                })
              }
              className="border w-full px-3 py-2 mb-4 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm transition hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await dispatch(
                    updateCustomerThunk({
                      id: editingCustomer.id,
                      updates: editingCustomer,
                    })
                  );
                  setEditingCustomer(null);
                  dispatch(fetchCustomersThunk());
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition hover:scale-105"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-2xl animate-fadeIn">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Customer Details
            </h2>
            <p className="text-sm">
              <strong>Name:</strong> {selectedCustomer.name}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {selectedCustomer.email}
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> {selectedCustomer.phone}
            </p>
            <p className="text-sm">
              <strong>Status:</strong> {selectedCustomer.status}
            </p>
            <button
              onClick={() => dispatch(clearSelectedCustomer())}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md text-sm shadow transition hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
