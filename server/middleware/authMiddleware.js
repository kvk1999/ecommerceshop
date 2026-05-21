import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    // role is included via userPayload in auth responses

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
