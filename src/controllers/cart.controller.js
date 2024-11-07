import { cartService } from "../services/cart.service.js";
import { productService } from "../services/product.service.js";
import { ticketService } from "../services/ticket.service.js";
import { CustomError } from "../utils/errors/custom.error.js";
import { mailService } from "../utils/emails.js";
import { v4 as uuidv4 } from "uuid";
import errors from "../utils/errors/dictionaty.errors.js";

class CartController {
  async addCart(req, res, next) {
    try {
      const cart = await cartService.create({ products: [] });
      res.status(200).json({ result: "success", cart });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const carts = await cartService.getAll();
      res.status(200).json({ result: "success", carts });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    const { cid } = req.params;
    try {
      const cart = await cartService.getById(cid);
      if (!cart) return CustomError.newError(errors.notFound, "Cart not found");
      res.status(200).json({ response: "success", cart });
    } catch (error) {
      next(error);
    }
  }

  async addProductToCart(req, res, next) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      if (!Number.isFinite(quantity))
        return CustomError.newError(errors.badRequest, "Quantity must be a number");

      const cart = await cartService.getById(cid);
      if (!cart) return CustomError.newError(errors.notFound, "Cart not found");

      const product = await productService.getById(pid);
      if (!product) return CustomError.newError(errors.notFound, "Product not found");

      //Stock control
      if (quantity > product.stock) return CustomError.newError(errors.conflict, "Out of Stock");

      if (quantity < 1)
        return CustomError.newError(errors.badRequest, "Quantity cannot be less than 1");

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.product._id.toString() === pid.toString()
      );

      if (existingProductIndex !== -1) {
        if (cart.products[existingProductIndex].quantity + quantity > product.stock)
          return res.status(409).json({
            response: "Error",
            message: "Out of stock", //409 - Out of stock - TO DO  Personalized message
            in_stock: product.stock,
            you_have_in_cart: cart.products[existingProductIndex].quantity,
          });

        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: pid, quantity });
      }
      await cart.save();
      res.status(200).json({ result: "Success", message: "Product added to cart" });
    } catch (error) {
      next(error);
    }
  }

  async deleteProductFromCart(req, res, next) {
    const { cid, pid } = req.params;
    try {
      const cart = await cartService.getById(cid);
      if (!cart) return CustomError.newError(errors.notFound, "Cart not found");

      const product = await productService.getById(pid);
      if (!product) return CustomError.newError(errors.notFound, "Product not found");

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.product._id.toString() === pid.toString()
      );

      if (existingProductIndex !== -1) {
        cart.products.splice(existingProductIndex, 1);
      } else {
        return CustomError.newError(errors.notFound, "Product not found in cart");
      }
      await cart.save();
      res.status(200).json({ result: "Success", message: "Product deleted from cart" });
    } catch (error) {
      next(error);
    }
  }

  async updateCart(req, res, next) {
    const { cid } = req.params;
    const { products } = req.body;

    try {
      const cart = await cartService.getById(cid);
      if (!cart) return CustomError.newError(errors.notFound, "Cart not found");
      if (!Array.isArray(products))
        return CustomError.newError(errors.badRequest, "Products must be an array");

      for (const item of products) {
        const productId = item.product;
        const quantity = item.quantity;

        const product = await productService.getById(productId);

        if (!product) return CustomError.newError(errors.notFound, "Product not found");

        //Update cart with products and quantity
        const existingProductIndex = cart.products.findIndex(
          (prod) => prod.product._id.toString() === productId.toString()
        );

        if (existingProductIndex !== -1) {
          //If the product is already in the cart, update the quantity
          cart.products[existingProductIndex].quantity = quantity;
        } else {
          //If the product is not in the cart, add it
          cart.products.push({ product: productId, quantity });
        }
      }
      await cart.save();
      res.status(200).json({ result: "Success", message: "Cart updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async updateQuantity(req, res, next) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const cart = await cartService.getById(cid);
      if (!cart) return CustomError.newError(errors.notFound, "Cart not found");

      const product = await productService.getById(pid);
      if (!product) return CustomError.newError(errors.notFound, "Product not found");

      //Stock control
      if (quantity > product.stock) return CustomError.newError(errors.notFound, "Out of stock");

      if (quantity < 1)
        return CustomError.newError(errors.conflict, "Quantity cannot be less than 1");

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.product._id.toString() === pid.toString()
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity = quantity;
      } else {
        return CustomError.newError(errors.notFound, "Product not found in cart");
      }

      await cart.save();
      res.status(200).json({ result: "Success", message: "Product quantity updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async emptyCart(req, res, next) {
    const { cid } = req.params;
    try {
      const cart = await cartService.getById(cid);
      if (!cart) return CustomError.newError(errors.notFound, "Cart not found");
      cart.products = [];
      await cart.save();
      res.status(200).json({ result: "Success", message: "Cart emptied successfully" });
    } catch (error) {
      next(error);
    }
  }

  async deleteAllCarts(req, res, next) {
    try {
      await cartService.delete();
      res.status(200).json({ result: "Success", message: "All carts deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async purchase(req, res, next) {
    const { cid } = req.params;

    try {
      const cart = await cartService.getById(cid);
      if (!cart) return CustomError.newError(errors.notFound, "Cart not found");

      if (cart.products.length === 0)
        return CustomError.newError(errors.badRequest, "Cart is empty");

      const productsWithoutStock = [];

      cart.products.forEach((p) => {
        if (p.product?.stock < p.quantity) {
          productsWithoutStock.push({
            productId: p.product._id,
            productName: p.product.name,
            quantity: p.quantity,
            stock: p.product.stock,
          });
        }
      });

      /* if (productsWithoutStock.length > 0) {
        return res.status(400).json({
          error: "Insufficient stock", // 400 - Insuficient stock - TODO
          details: productsWithoutStock,
        });
      } */

      if (productsWithoutStock.length > 0)
        return CustomError.newError(errors.badRequest, "Insuficient stock", productsWithoutStock); // 400 - Insuficient stock - TODO

      const promises = cart.products.map((p) =>
        productService.discountStock(p.product._id, p.quantity)
      );

      await Promise.all(promises);

      const amount = cart.products.reduce(
        (acc, curr) => acc + curr.quantity * curr.product.price,
        0
      );

      const productDetails = cart.products.map((p) => ({
        name: p.product.title,
        quantity: p.quantity,
        price: p.product.price,
      }));

      //Ticket
      const ticket = await ticketService.create({
        code: uuidv4(),
        purchase_datatime: new Date(),
        amount,
        purchaser: req.user._id,
        products: cart.products.map((p) => ({ product: p.product._id, quantity: p.quantity })),
      });

      cart.products = [];
      await cart.save();

      //Send Email
      await mailService.sendMail({
        name: `${req.user.first_name} ${req.user.last_name}`,
        to: req.user.email,
        subject: "Compra recibida",
        type: "buy",
        amount,
        products: productDetails,
      });

      res.status(200).json({ message: "Buy success", ticket });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
