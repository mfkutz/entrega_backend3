import { userModel } from "../models/user.model.js";

class UserService {
  async getAllUsers() {
    return await userModel.find();
  }

  async getUserById(id) {
    return await userModel.findById(id);
  }

  /*  async findOne(email, proyection = {}) {
    return await userModel.findOne(email, proyection);
  } */

  async findOne(filter, projection = {}) {
    return await userModel.findOne(filter, projection);
  }

  async createUser(user) {
    return await userModel.create(user);
  }

  async updateUser(id, user) {
    return await userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async deleteUser(id) {
    return await userModel.findByIdAndDelete(id);
  }
}

export const userService = new UserService();
