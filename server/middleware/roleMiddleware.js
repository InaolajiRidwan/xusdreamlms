export const authorizeRole = (...allowRoles) => {
  return (req, res, next) => {
    if (!allowRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
    next();
  };
};
