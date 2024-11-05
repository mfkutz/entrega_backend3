import passport from "passport";

export function passportCall(strategy) {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, function (error, user, info) {
      if (error) return next(error);

      if (!user) {
        const message = info && info.message ? info.message : "Unauthorized";
        return res.status(401).json({ error: "Unauthorized", details: message });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
}
