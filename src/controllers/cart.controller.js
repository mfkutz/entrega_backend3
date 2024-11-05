import { cartService } from "../services/cart.service.js";
import { productService } from "../services/product.service.js";
import { ticketService } from "../services/ticket.service.js";
import { mailService } from "../utils/emails.js";
import { v4 as uuidv4 } from "uuid";

class CartController {
  async addCart(req, res) {
    try {
      const cart = await cartService.create({ products: [] });
      res.status(200).json({ result: "success", cart });
    } catch (error) {
      res.status(500).json({ result: "Error", message: error });
    }
  }

  async getAll(req, res) {
    try {
      const carts = await cartService.getAll();
      res.status(200).json({ result: "success", carts });
    } catch (error) {
      res.status(500).json({ result: "Error", message: error });
    }
  }

  async getById(req, res) {
    const { cid } = req.params;
    try {
      const cart = await cartService.getById(cid);
      if (!cart) return res.status(404).json({ message: "Cart not found" });
      res.status(200).json({ response: "success", cart });
    } catch (error) {
      res.status(500).json({ response: "Error", message: error });
    }
  }

  async addProductToCart(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      if (!Number.isFinite(quantity))
        return res.status(400).json({ response: "Error", message: "Quantity must be a number" });

      const cart = await cartService.getById(cid);
      if (!cart) return res.status(404).json({ response: "Error", message: "Cart not found" });

      const product = await productService.getById(pid);
      if (!product)
        return res.status(404).json({ response: "Error", message: "Product not found" });

      //Stock control
      if (quantity > product.stock)
        return res.status(404).json({
          response: "Error",
          message: "Out of stock",
          in_stock: product.stock,
        });

      if (quantity < 1)
        return res
          .status(404)
          .json({ response: "Error", message: "Quantity cannot be less than 1" });

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.product._id.toString() === pid.toString()
      );

      if (existingProductIndex !== -1) {
        if (cart.products[existingProductIndex].quantity + quantity > product.stock)
          return res.status(404).json({
            response: "Error",
            message: "Out of stock",
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
      res.status(500).json({ response: "Error", message: error.message });
    }
  }

  async deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;
    try {
      const cart = await cartService.getById(cid);
      if (!cart) return res.status(404).json({ response: "Error", message: "Cart not found" });

      const product = await productService.getById(pid);
      if (!product)
        return res.status(404).json({ response: "Error", message: "Product not found" });

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.product._id.toString() === pid.toString()
      );

      if (existingProductIndex !== -1) {
        cart.products.splice(existingProductIndex, 1);
      } else {
        return res.status(404).send({ result: "Error", message: "Product not found in cart" });
      }
      await cart.save();
      res.status(200).json({ result: "Success", message: "Product deleted from cart" });
    } catch (error) {
      res.status(500).json({ response: "Error", message: error.message });
    }
  }

  async updateCart(req, res) {
    const { cid } = req.params;
    // const products = req.body.products;
    const { products } = req.body;

    try {
      const cart = await cartService.getById(cid);
      if (!cart) return res.status(404).json({ response: "Error", message: "Cart not found" });
      if (!Array.isArray(products))
        return res.status(400).json({ response: "Error", message: "Products must be an array" });

      for (const item of products) {
        const productId = item.product;
        const quantity = item.quantity;

        const product = await productService.getById(productId);

        if (!product)
          return res
            .status(404)
            .json({ response: "Error", message: `Product ${productId} not found` });

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
      res.status(500).json({ response: "Error", message: error.message });
    }
  }

  async updateQuantity(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const cart = await cartService.getById(cid);
      if (!cart) return res.status(404).json({ response: "Error", message: "Cart not found" });

      const product = await productService.getById(pid);
      if (!product)
        return res.status(404).json({ response: "Error", message: "Product not found" });

      //Stock control
      if (quantity > product.stock)
        return res
          .status(404)
          .json({ response: "Error", message: "out of stock", in_stock: product.stock });

      if (quantity < 1)
        return res
          .status(404)
          .json({ response: "Error", message: "Quantity cannot be less than 1" });

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.product._id.toString() === pid.toString()
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity = quantity;
      } else {
        return res.status(404).json({ response: "Error", message: "Product not found in cart" });
      }

      await cart.save();
      res.status(200).json({ result: "Success", message: "Product quantity updated successfully" });
    } catch (error) {
      res.status(500).json({ response: "Error", message: error.message });
    }
  }

  async emptyCart(req, res) {
    const { cid } = req.params;
    try {
      const cart = await cartService.getById(cid);
      if (!cart) return res.status(404).json({ response: "Error", message: "Cart not found" });
      cart.products = [];
      await cart.save();
      res.status(200).json({ result: "Success", message: "Cart emptied successfully" });
    } catch (error) {
      res.status(500).json({ response: "Error", message: error.message });
    }
  }

  async deleteAllCarts(req, res) {
    try {
      await cartService.delete();
      res.status(200).json({ result: "Success", message: "All carts deleted successfully" });
    } catch (error) {
      res.status(500).json({ response: "Error", message: error.message });
    }
  }

  async purchase(req, res) {
    const { cid } = req.params;

    try {
      const cart = await cartService.getById(cid);
      if (!cart) return res.status(404).json({ response: "Error", message: "Cart not found" });

      if (cart.products.length === 0)
        return res.status(400).json({ response: "Error", message: "Cart is empty" });

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

      if (productsWithoutStock.length > 0) {
        return res.status(400).json({
          error: "Insufficient stock",
          details: productsWithoutStock,
        });
      }

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
      res.status(500).json({ response: "Error", message: error.message });
    }
  }
}

export const cartController = new CartController();
