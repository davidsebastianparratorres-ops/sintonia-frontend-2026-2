const API_BASE =
  String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

export { API_BASE };
export default API_BASE;
