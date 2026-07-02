export const apiUpload = async (endpoint, formData, method = "POST") => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`/api${endpoint}`, {
    method,
    headers,
    body: formData,
  });

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  const text = await response.text();
  return { status: response.status, message: text || "Non-JSON response" };
};