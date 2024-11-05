import { userService } from "../services/user.service.js";
import { CustomError } from "../utils/errors/custom.error.js";
import errors from "../utils/errors/dictionaty.errors.js";

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await userService.getUserById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const user = await userService.deleteUser(id);
      // if (!user) return res.status(404).json({ message: "User not found" });
      if (!user) {
        return CustomError.newError(errors.notFound);
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const { first_name, last_name, email, age, role } = req.body;
    try {
      const user = await userService.updateUser(id, {
        first_name,
        last_name,
        email,
        age,
        role,
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const userController = new UserController();
