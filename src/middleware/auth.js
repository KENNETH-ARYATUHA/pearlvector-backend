// auth.js
// -------
// Middleware that checks for a valid login token before allowing access
// to admin-only routes (add/edit/delete anything). Public GET routes
// (used by the live website) do NOT use this -- anyone can view content,
// only admins can change it.
const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization; // expects "Bearer <token>"
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // attach admin info to the request for later use
    next(); // token is valid, continue to the actual route
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;