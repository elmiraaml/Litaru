// CLIENT — aman diimport dari komponen "use client".
// Karena backend & frontend satu project Next.js yang sama, kita fetch relatif ke /api/...

export const api = async (endpoint, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`/api${endpoint}`, {
    cache: "no-store",
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  const text = await response.text();
  return { status: response.status, message: text || "Non-JSON response" };
};