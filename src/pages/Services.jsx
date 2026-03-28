import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategories,
  fetchAllServices,
  addService,
  updateService,
  deleteService,
} from "../slices/Services/thunk";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function ServicesPage() {
  const dispatch = useDispatch();
  const { categories = [], services = [], loading, error } = useSelector(
    (state) => state.services
  );

  const [addingService, setAddingService] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    baseprice: 0,
    category: "",
  });
  const [editingService, setEditingService] = useState(null);
  const [editingServiceData, setEditingServiceData] = useState({});
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllServices());
  }, [dispatch]);

  // ================= ADD =================
  const handleAddService = async () => {
    if (!newService.title.trim() || !newService.category) return;

    await dispatch(
      addService({
        title: newService.title,
        description: newService.description,
        baseprice: newService.baseprice,
        service_categoryId: newService.category,
        isActive: true,
      })
    );

    setNewService({
      title: "",
      description: "",
      baseprice: 0,
      category: "",
    });
    setAddingService(false);

    dispatch(fetchAllServices());
  };

  // ================= UPDATE =================
  const handleUpdateService = async (id) => {
    await dispatch(updateService({ id, updates: editingServiceData }));
    setEditingService(null);
    dispatch(fetchAllServices());
  };

  // ================= DELETE =================
  const handleDeleteService = async (id) => {
    if (window.confirm("Delete this service?")) {
      await dispatch(deleteService(id));
      dispatch(fetchAllServices());
    }
  };

  // ================= FILTER (FIXED) =================
  const filteredServices = services
    .filter((s) =>
      filterCategory
        ? s?.service_categoryId?._id === filterCategory
        : true
    )
    .filter((s) =>
      (s?.title || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase())
    );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-green-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Services
      </h1>

      {/* Top Card */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4 flex-1">
          <h3 className="text-sm text-gray-500">Total Services</h3>
          <p className="text-xl font-bold">{services.length}</p>
        </div>
      </div>

      {/* Filter + Search + Add */}
      <div className="flex gap-4 mb-6">
        <div className="w-60">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-60">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Services"
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="w-48">
          <button
            onClick={() => setAddingService(true)}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-500 text-white rounded-xl"
          >
            <FaPlus /> Add Service
          </button>
        </div>
      </div>

      {/* ADD FORM */}
      {addingService && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-md space-y-3">
          <input
            type="text"
            placeholder="Service Name"
            value={newService.title}
            onChange={(e) =>
              setNewService({ ...newService, title: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          <textarea
            placeholder="Description"
            value={newService.description}
            onChange={(e) =>
              setNewService({
                ...newService,
                description: e.target.value,
              })
            }
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="number"
            placeholder="Price"
            value={newService.baseprice}
            onChange={(e) =>
              setNewService({
                ...newService,
                baseprice: Number(e.target.value),
              })
            }
            className="w-full border rounded px-3 py-2"
          />

          <select
            value={newService.category}
            onChange={(e) =>
              setNewService({
                ...newService,
                category: e.target.value,
              })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={handleAddService}
              className="px-4 py-2 bg-green-500 text-white rounded w-full"
            >
              Save
            </button>
            <button
              onClick={() => setAddingService(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{String(error)}</p>}
        {filteredServices.length === 0 && (
          <p className="text-gray-500">No services found</p>
        )}

        {filteredServices.map((srv) => (
          <div
            key={srv._id}
            className="p-4 bg-white rounded-xl shadow-md flex justify-between items-center"
          >
            <div>
              {editingService === srv._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingServiceData.title || ""}
                    onChange={(e) =>
                      setEditingServiceData({
                        ...editingServiceData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                  <textarea
                    value={editingServiceData.description || ""}
                    onChange={(e) =>
                      setEditingServiceData({
                        ...editingServiceData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    value={editingServiceData.baseprice || 0}
                    onChange={(e) =>
                      setEditingServiceData({
                        ...editingServiceData,
                        baseprice: Number(e.target.value),
                      })
                    }
                    className="w-full border rounded px-2 py-1"
                  />

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateService(srv._id)}
                      className="text-green-600"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => setEditingService(null)}
                      className="text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium">
                    {srv.title || "Untitled Service"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {srv.description || "-"}
                  </p>
                  <p className="text-sm font-semibold text-gray-600">
                    {srv.service_categoryId?.name || "No Category"}
                  </p>
                </div>
              )}
            </div>

            {editingService !== srv._id && (
              <div className="flex items-center gap-3">
                <p className="font-semibold text-blue-600">
                  ₹{srv.baseprice ?? 0}
                </p>

                <button
                  onClick={() => {
                    setEditingService(srv._id);
                    setEditingServiceData({
                      title: srv.title || "",
                      description: srv.description || "",
                      baseprice: srv.baseprice || 0,
                    });
                  }}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDeleteService(srv._id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}