import { productModel } from "../models/products.model.js";

class ProductService {
  async create(product) {
    return await productModel.create(product);
  }

  async update(id, updateFields) {
    return await productModel.findByIdAndUpdate(id, updateFields, { new: true });
  }

  async delete(id) {
    return await productModel.findByIdAndDelete(id);
  }

  async getAll() {
    return await productModel.find();
  }

  async getById(id) {
    return await productModel.findById(id);
  }

  async paginate(queries, options) {
    return await productModel.paginate(queries, options);
  }

  async discountStock(id, quantity) {
    return await productModel.updateOne({ _id: id }, { $inc: { stock: -quantity } });
  }
}

export const productService = new ProductService();
