import { userService } from "../services/user.service.js";
import { CustomError } from "../utils/errors/custom.error.js";
import errors from "../utils/errors/dictionaty.errors.js";

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    const { id } = req.params;
    try {
      const user = await userService.getUserById(id);
      if (!user) return CustomError.newError(errors.userNotFound);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    const { id } = req.params;
    try {
      const user = await userService.deleteUser(id);
      if (!user) return CustomError.newError(errors.userNotFound);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
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
      if (!user) return CustomError.newError(errors.userNotFound);
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
