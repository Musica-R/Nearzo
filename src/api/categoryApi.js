import api from "./axios";

export const fetchCategories = () => api.get("/categories");


const VENDOR_TYPES_URL = "https://booking.mpdatahub.com/api/list-category?type=vendor";

let cache = null;

/** Returns [{ type: "Home Services", categories: ["Plumber", ...] }, ...] */
export const fetchVendorTypes = async () => {
  if (cache) return cache;
  const res = await fetch(VENDOR_TYPES_URL);
  if (!res.ok) throw new Error("Could not load vendor categories");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Could not load vendor categories");
  cache = json.data || [];
  return cache;
};