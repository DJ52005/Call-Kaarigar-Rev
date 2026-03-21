import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkerReviewsThunk,
  fetchCustomerReviewsThunk,
} from "../slices/ReviewRating/thunk";
import { MdStarRate, MdPeople, MdWork, MdPerson } from "react-icons/md";

export default function ReviewsRatings() {
  const dispatch = useDispatch();
  const { workerReviews, customerReviews, loading, error } = useSelector(
    (state) => state.reviewRating
  );

  useEffect(() => {
    dispatch(fetchWorkerReviewsThunk());
    dispatch(fetchCustomerReviewsThunk());
  }, [dispatch]);

  // derived stats
  const allReviews = [...(workerReviews || []), ...(customerReviews || [])];
  const totalReviews = allReviews.length;
  const avgRating =
    allReviews.length > 0
      ? (
          allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          allReviews.length
        ).toFixed(1)
      : 0;

  const exportCSV = (data, filename) => {
    if (!data || !data.length) return;
    const header = ["ID", "User", "Rating", "Comment", "Date"];
    const rows = data.map((r) => [
      r.id,
      r.user || r.name || r.customerName || r.workerName,
      r.rating,
      `"${String(r.comment).replace(/"/g, '""')}"`,
      new Date(r.date).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((row) => row.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-green-50 to-green-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-1 text-gray-900">Reviews & Ratings</h2>
      <p className="text-gray-600 mb-6">
        Feedback from both customers and workers
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg">
          <MdPeople className="text-green-600 text-3xl mx-auto mb-2" />
          <h4 className="text-gray-500 font-medium">Total Reviews</h4>
          <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg">
          <MdStarRate className="text-yellow-500 text-3xl mx-auto mb-2" />
          <h4 className="text-gray-500 font-medium">Average Rating</h4>
          <p className="text-2xl font-bold text-gray-900">{avgRating} ⭐</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg">
          <MdWork className="text-blue-600 text-3xl mx-auto mb-2" />
          <h4 className="text-gray-500 font-medium">Worker Reviews</h4>
          <p className="text-2xl font-bold text-gray-900">{workerReviews.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg">
          <MdPerson className="text-purple-600 text-3xl mx-auto mb-2" />
          <h4 className="text-gray-500 font-medium">Customer Reviews</h4>
          <p className="text-2xl font-bold text-gray-900">{customerReviews.length}</p>
        </div>
      </div>

      {loading && <p className="text-gray-500 mb-4">Loading reviews...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReviewTable
          title="Worker Reviews"
          data={workerReviews}
          exportCSV={() => exportCSV(workerReviews, "worker_reviews")}
        />
        <ReviewTable
          title="Customer Reviews"
          data={customerReviews}
          exportCSV={() => exportCSV(customerReviews, "customer_reviews")}
        />
      </div>
    </div>
  );
}

function ReviewTable({ title, data, exportCSV }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md transition hover:scale-105 hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition shadow"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full text-sm text-left text-gray-700 border-collapse">
        <thead>
          <tr className="bg-green-50 text-gray-600 text-xs uppercase tracking-wide">
            <th className="px-4 py-3 rounded-tl-xl">User</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Comment</th>
            <th className="px-4 py-3 rounded-tr-xl">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((r, idx) => (
              <tr
                key={r.id}
                className={`transition ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-green-50`}
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {r.user || r.name || r.customerName || r.workerName}
                </td>
                <td className="px-4 py-3">{"⭐".repeat(r.rating || 0)}</td>
                <td className="px-4 py-3 max-w-xs truncate">{r.comment}</td>
                <td className="px-4 py-3">
                  {new Date(r.date).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-4 py-6 text-center text-gray-400 italic"
              >
                No reviews found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
