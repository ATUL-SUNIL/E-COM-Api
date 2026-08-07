// Authorization guard — run AFTER jwtAuth (which sets req.userRole).
// Allows the request only if the user's role is one of the permitted roles.
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.userRole || !roles.includes(req.userRole)) {
    return res.status(403).send("forbidden: insufficient permissions");
  }
  next();
};
