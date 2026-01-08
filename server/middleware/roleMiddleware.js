

export const authorizeRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user?.role
    if (userRole !== role) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
    next();
  };
};
