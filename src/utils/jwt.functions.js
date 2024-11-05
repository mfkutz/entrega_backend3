import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export function generateToken(payload) {
  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
}

//This function is not uset in the project, but it's here if you want to use it
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token " + error);
  }
}
