// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookingsThunks from "../slices/Bookings/thunk";

export default function Orders() {
  const dispatch = useDispatch();
  const { list: rawList = [], loading, error } = useSelector(
    (state) => state.bookings || {}
  );

  const bookings = Array.isArray(rawList) ? rawList : rawList?.data || [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const fetchAction =
    bookingsThunks.fetchBookings ||
    bookingsThunks.fetchBookingsThunk ||
    bookingsThunks.fetchBookingsAsync;
  const cancelAction =
    bookingsThunks.cancelBookingThunk ||
    bookingsThunks.cancelBooking ||
    bookingsThunks.deleteBookingThunk ||
    bookingsThunks.deleteBooking;

  const doFetchBookings = () => {
    if (!fetchAction) {
      console.error("fetchBookings thunk not found");
      return;
    }
    dispatch(fetchAction());
  };

  useEffect(() => {
    doFetchBookings();
    const interval = setInterval(() => {
      doFetchBookings();
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const totalOrders = bookings.length;
  const pendingOrders = bookings.filter((b) => b.status === "pending").length;
  const inProgressOrders = bookings.filter((b) => b.status === "in-progress").length;
  const completedOrders = bookings.filter((b) => b.status === "completed").length;
  const cancelledOrders = bookings.filter((b) => b.status === "cancelled").length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.customerId?.name ||
        b.customerName ||
        b.customer?.name ||
        b.customer ||
        "")
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (b.id || b._id || "")
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || b.status === statusFilter;
    const matchesCity = cityFilter === "All Cities" || b.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / bookingsPerPage)
  );
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  const handleCancel = async (rawBooking) => {
    const bookingId = rawBooking?._id || rawBooking?.id || rawBooking?.bookingId;
    if (!bookingId) {
      alert("Cannot cancel: booking id missing.");
      return;
    }

    try {
      const result = await dispatch(
        cancelAction({ bookingId, workerServiceId: rawBooking?.workerServiceId })
      ).unwrap();

      alert("Booking cancelled successfully ✅");
      doFetchBookings();
    } catch (err) {
      if (err?.toString().includes("Notification validation failed")) {
        alert("Booking cancelled ✅ (notification failed on backend)");
        doFetchBookings();
      } else {
        alert("❌ Failed to cancel booking: " + (err?.message || JSON.stringify(err)));
      }
    }
  };

  const exportToCSV = () => {
    if (filteredBookings.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = [
      "Order ID",
      "Description",
      "Customer Name",
      "Customer Email",
      "Worker Name",
      "Worker Email",
      "Price",
      "Status",
      "City",
      "Booking Date",
      "Time Slot",
      "Payment Method",
    ];

    const rows = filteredBookings.map((b) => [
      b.id || b._id || "",
      b.description || "N/A",
      b.customerId?.name ||
        b.customerName ||
        b.customer?.name ||
        b.customer ||
        "N/A",
      b.customerId?.email || b.customerEmail || b.customer?.email || "N/A",
      b.workerId?.name || b.workerName || b.worker?.name || "N/A",
      b.workerId?.email || b.workerEmail || b.worker?.email || "N/A",
      b.price || 0,
      b.status,
      b.city || "N/A",
      b.bookingDate || "N/A",
      b.timeSlot || "N/A",
      b.paymentMethod || "N/A",
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    link.setAttribute("download", "bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bookings Management</h2>
          <p className="text-gray-500">Track and manage service bookings</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#f97316] text-white px-4 py-2 rounded shadow-md transition hover:scale-105 hover:shadow-lg">
            Map View
          </button>
          <button
  className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium px-5 py-2 rounded-lg shadow-md
             transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
>
  Export CSV
</button>

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow border border-green-100 transition hover:scale-105 hover:shadow-xl">
          <h3 className="text-xl font-bold">{totalOrders}</h3>
          <p className="text-gray-500">Total Orders</p>
        </div>
        <div className="bg-white p-4 rounded shadow border border-yellow-100 transition hover:scale-105 hover:shadow-xl">
          <h3 className="text-xl font-bold">{pendingOrders}</h3>
          <p className="text-[#f97316]">Pending</p>
        </div>
        <div className="bg-white p-4 rounded shadow border border-blue-100 transition hover:scale-105 hover:shadow-xl">
          <h3 className="text-xl font-bold">{inProgressOrders}</h3>
          <p className="text-blue-500">In Progress</p>
        </div>
        <div className="bg-white p-4 rounded shadow border border-green-100 transition hover:scale-105 hover:shadow-xl">
          <h3 className="text-xl font-bold">{completedOrders}</h3>
          <p className="text-green-600">Completed</p>
        </div>
        <div className="bg-white p-4 rounded shadow border border-red-100 transition hover:scale-105 hover:shadow-xl">
          <h3 className="text-xl font-bold">{cancelledOrders}</h3>
          <p className="text-red-600">Cancelled</p>
        </div>
        <div className="bg-white p-4 rounded shadow border border-green-100 transition hover:scale-105 hover:shadow-xl">
          <h3 className="text-xl font-bold">₹{totalRevenue}</h3>
          <p className="text-green-700">Revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by order ID, customer name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded flex-1 shadow-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded shadow-sm"
        >
          <option>All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded shadow-sm"
        >
          <option>All Cities</option>
          {[...new Set(bookings.map((b) => b.city || "Unknown"))].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Orders */}
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{String(error)}</p>}
      {!loading && paginatedBookings.length === 0 && <p>No orders found.</p>}

      <div className="space-y-4">
        {paginatedBookings.map((b) => {
          const displayId = b.id || b._id || b.bookingId;
          return (
            <div
              key={displayId || Math.random()}
              className={`p-4 rounded shadow border transition hover:shadow-xl hover:scale-[1.01] ${
                b.status === "cancelled"
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-green-100"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {b.description || "No description"}
                  </h3>
                  <p className="text-gray-600 text-sm">Order ID: {displayId}</p>
                  <p className="text-sm">
                    Customer:{" "}
                    {b.customerId?.name ||
                      b.customerName ||
                      b.customer?.name ||
                      b.customer ||
                      "N/A"}
                  </p>
                  <p className="text-sm">
                    Worker:{" "}
                    {b.workerId?.name || b.workerName || b.worker?.name || "N/A"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {b.city || "Unknown"}, {b.bookingDate || "N/A"} {b.timeSlot || ""}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg text-gray-800">₹{b.price || 0}</h3>
                  <p
                    className={`${
                      b.status === "completed"
                        ? "text-green-600"
                        : b.status === "in-progress"
                        ? "text-blue-500"
                        : b.status === "cancelled"
                        ? "text-red-600 font-semibold"
                        : "text-[#f97316]"
                    } text-sm`}
                  >
                    {b.status}
                  </p>
                  <div className="flex gap-2 justify-end mt-2">
                    {b.status !== "completed" && b.status !== "cancelled" && (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded shadow-md transition hover:scale-105 hover:shadow-lg"
                        onClick={() => handleCancel(b)}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="bg-[#f97316] text-white px-3 py-1 rounded shadow-md transition hover:scale-105 hover:shadow-lg"
                      onClick={() => setSelectedBooking(b)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-white disabled:opacity-50 hover:bg-green-100 transition"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded transition ${
                currentPage === i + 1
                  ? "bg-[#f97316] text-white shadow"
                  : "bg-white hover:bg-green-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-white disabled:opacity-50 hover:bg-green-100 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-2/3 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedBooking(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Booking Details</h2>
            <p>
              <strong>Order ID:</strong> {selectedBooking.id || selectedBooking._id}
            </p>
            <p>
              <strong>Description:</strong> {selectedBooking.description}
            </p>
            <p>
              <strong>Customer:</strong>{" "}
              {selectedBooking.customerId?.name ||
                selectedBooking.customerName ||
                selectedBooking.customer?.name ||
                selectedBooking.customer ||
                "N/A"}{" "}
              (
              {selectedBooking.customerId?.email ||
                selectedBooking.customerEmail ||
                selectedBooking.customer?.email ||
                "N/A"}
              )
            </p>
            <p>
              <strong>Worker:</strong>{" "}
              {selectedBooking.workerId?.name ||
                selectedBooking.workerName ||
                selectedBooking.worker?.name ||
                "N/A"}{" "}
              (
              {selectedBooking.workerId?.email ||
                selectedBooking.workerEmail ||
                selectedBooking.worker?.email ||
                "N/A"}
              )
            </p>
            <p>
              <strong>Price:</strong> ₹{selectedBooking.price}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>
            <p>
              <strong>City:</strong> {selectedBooking.city}
            </p>
            <p>
              <strong>Booking Date:</strong> {selectedBooking.bookingDate}{" "}
              {selectedBooking.timeSlot}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {selectedBooking.paymentMethod || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
