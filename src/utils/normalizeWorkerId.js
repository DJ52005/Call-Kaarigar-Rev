// Converts a worker object or _id field into a proper string ID
export const normalizeWorkerId = (worker) => {
  if (!worker) return "";

  // If worker is already a string
  if (typeof worker === "string") return worker;

  // If worker has id or _id as string
  if (typeof worker.id === "string") return worker.id;
  if (typeof worker._id === "string") return worker._id;

  // If worker._id is an object (Mongo ObjectId or similar)
  if (typeof worker._id === "object" && worker._id !== null) {
    return worker._id.$oid || JSON.stringify(worker._id);
  }

  return ""; // fallback empty string
};
