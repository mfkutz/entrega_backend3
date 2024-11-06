import { generateToken } from "../utils/jwt.functions.js";

class AuthController {
  async login(req, res, next) {
    try {
      const payload = {
        email: req.user.email,
        role: req.user.role,
      };
      const token = generateToken(payload);
      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
      return res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      res.status(200).json({ message: "Registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  async current(req, res, next) {
    try {
      res.status(200).json({ message: "Current user", user: req.user });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("token", { httpOnly: true, path: "/" });
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
