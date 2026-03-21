import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategories,
  fetchAllServices,
  deleteCategory,
  updateCategory,
  addCategory,
} from "../slices/Services/thunk";

export default function CategoriesTable() {
  const dispatch = useDispatch();
  const { categories = [], services = [], loading } = useSelector(
    (state) => state.services
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    dispatch(fetchAllServices());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Compute serviceCount per category
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    serviceCount: services.filter(
      (s) => s.service_categoryId?._id === cat._id
    ).length,
  }));

  const totalPages = Math.ceil(categoriesWithCount.length / rowsPerPage);

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const visibleCategories = categoriesWithCount.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  // ---- ACTION HANDLERS ----
  const handleDelete = (cat) => {
    if (!cat?._id) return;

    if (cat.serviceCount > 0) {
      setModalMessage(
        "This category contains services. Please delete the services first before deleting the category."
      );
      setShowModal(true);
      return;
    }

    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(cat._id)).then(() => {
        dispatch(fetchAllCategories());
      });
    }
  };

  const handleEdit = (cat) => {
    const newName = prompt("Enter new category name:", cat.name);
    if (!newName || newName.trim() === "") return;

    const newDescription = prompt(
      "Enter new description:",
      cat.description || ""
    );

    dispatch(
      updateCategory({
        id: cat._id,
        updates: { name: newName, description: newDescription },
      })
    ).then(() => {
      dispatch(fetchAllCategories());
    });
  };

  const handleAddCategory = () => {
    const name = prompt("Enter new category name:");
    if (!name || name.trim() === "") return;

    const description = prompt("Enter description (optional):");

    dispatch(addCategory({ name, description })).then(() => {
      dispatch(fetchAllCategories());
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      {/* Top Cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { label: "Total Categories", value: categories.length },
          { label: "Total Services", value: services.length },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white shadow-lg rounded-lg p-4 flex-1 min-w-[150px] transition-transform transform hover:scale-105"
          >
            <h3 className="text-sm text-gray-500">{card.label}</h3>
            <p className="text-xl font-bold">{card.value}</p>
          </div>
        ))}
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition-transform transform hover:scale-105 self-center"
        >
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-gradient-to-r from-green-400 to-blue-400 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Category Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Description
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Services Count
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : visibleCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No categories available
                </td>
              </tr>
            ) : (
              visibleCategories.map((cat, idx) => (
                <tr
                  key={cat._id}
                  className={
                    idx % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100 transition-colors"
                      : "bg-white hover:bg-gray-100 transition-colors"
                  }
                >
                  <td className="px-4 py-2 text-sm">{cat.name}</td>
                  <td className="px-4 py-2 text-sm">{cat.description || "-"}</td>
                  <td className="px-4 py-2 text-sm">{cat.serviceCount}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded shadow hover:bg-red-600 transition-transform transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {categoriesWithCount.length > rowsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage + 1 === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Rows per page selector */}
      <div className="mt-2 flex items-center gap-2 text-sm">
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(0);
          }}
          className="border rounded px-2 py-1"
        >
          {[10, 25, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold text-red-600 mb-3">
              Cannot Delete Category
            </h2>
            <p className="text-gray-700">{modalMessage}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
