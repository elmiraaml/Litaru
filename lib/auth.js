import jwt from "jsonwebtoken";

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
}

export function verifyUser(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // { id, role, ... }
  } catch {
    return null;
  }
}

export function verifyAdmin(request) {
  const user = verifyUser(request);
  if (!user || !["admin", "superadmin"].includes(user.role)) return null;
  return user;
}