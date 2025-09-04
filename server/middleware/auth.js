import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.query.Authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};
