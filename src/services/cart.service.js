import { cartModel } from "../models/cart.model.js";

class CartService {
  async getAll() {
    return await cartModel.find();
  }

  async create(cart) {
    return await cartModel.create(cart);
  }

  async getById(id) {
    return await cartModel.findById(id);
  }

  async delete() {
    return await cartModel.deleteMany({});
  }
}

export const cartService = new CartService();
