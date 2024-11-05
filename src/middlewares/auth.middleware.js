export const autorization = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ error: "Don't have permission for this action" });
    }
    next();
  };
};
