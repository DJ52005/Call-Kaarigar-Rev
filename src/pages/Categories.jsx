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

  // modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // ✅ ADD CATEGORY MODAL
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchAllServices());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Compute serviceCount
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

  // ================= DELETE =================
  const handleDelete = (cat) => {
    if (!cat?._id) return;

    if (cat.serviceCount > 0) {
      setModalMessage(
        "This category contains services. Delete services first."
      );
      setShowModal(true);
      return;
    }

    if (window.confirm("Delete this category?")) {
      dispatch(deleteCategory(cat._id)).then(() => {
        dispatch(fetchAllCategories());
      });
    }
  };

  // ================= EDIT =================
  const handleEdit = (cat) => {
    const newName = prompt("Enter new name:", cat.name);
    if (!newName) return;

    const newDescription = prompt(
      "Enter description:",
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

  // ================= ADD =================
  const handleAddCategory = () => {
    setShowAddModal(true);
  };

  const handleSubmitCategory = () => {
    if (!newCategory.name.trim()) return;

    dispatch(addCategory(newCategory)).then(() => {
      dispatch(fetchAllCategories());
      setShowAddModal(false);
      setNewCategory({ name: "", description: "" });
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
            className="bg-white shadow-lg rounded-lg p-4 flex-1 min-w-[150px]"
          >
            <h3 className="text-sm text-gray-500">{card.label}</h3>
            <p className="text-xl font-bold">{card.value}</p>
          </div>
        ))}

        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
        >
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-gradient-to-r from-green-400 to-blue-400 text-white">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Services</th>
              <th className="px-4 py-2">Actions</th>
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
                <td colSpan={4} className="text-center py-4">
                  No categories
                </td>
              </tr>
            ) : (
              visibleCategories.map((cat, idx) => (
                <tr key={cat._id}>
                  <td className="px-4 py-2">{cat.name}</td>
                  <td className="px-4 py-2">
                    {cat.description || "-"}
                  </td>
                  <td className="px-4 py-2">{cat.serviceCount}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(cat)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
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

      {/* ADD CATEGORY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">
              Add Category
            </h2>

            <input
              type="text"
              placeholder="Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            <textarea
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  description: e.target.value,
                })
              }
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitCategory}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}