import { generateToken } from "../utils/jwt.functions.js";

class AuthController {
  async login(req, res) {
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
  }

  async register(req, res) {
    res.status(200).json({ message: "Registered successfully" });
  }

  async current(req, res) {
    res.status(200).json({ message: "Current user", user: req.user });
  }

  async logout(req, res) {
    res.clearCookie("token", { httpOnly: true, path: "/" });
    return res.status(200).json({ message: "Logged out successfully" });
  }
}

export const authController = new AuthController();
