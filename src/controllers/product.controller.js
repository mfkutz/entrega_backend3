import { productService } from "../services/product.service.js";
import { CustomError } from "../utils/errors/custom.error.js";
import errors from "../utils/errors/dictionaty.errors.js";

class ProductController {
  async addProduct(req, res, next) {
    let { title, description, price, status, thumbnail, code, stock, category } = req.body;

    status = stock > 0;
    try {
      let product = await productService.create({
        title,
        description,
        price,
        status,
        thumbnail,
        code,
        stock,
        category,
      });
      res.status(201).json({ result: "Success", message: product });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    const { id } = req.params;
    let { title, description, price, status, thumbnail, code, stock, category } = req.body;

    status = stock > 0;
    try {
      const product = await productService.update(id, {
        title,
        description,
        price,
        status,
        thumbnail,
        code,
        stock,
        category,
      });

      if (!product) return CustomError.newError(errors.notFound, "Product not found");

      res.status(200).json({ result: "Product updated successfully", message: product });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const allProducts = await productService.getAll();
      res.status(200).json({ result: "Success", products: allProducts });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    const { id } = req.params;
    try {
      const product = await productService.getById(id);
      if (!product) return CustomError.newError(errors.notFound, "Product not found");
      res.status(200).json({ result: "Product found", product });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    const { id } = req.params;
    try {
      const product = await productService.delete(id);
      if (!product) return CustomError.newError(errors.notFound, "Product not found");
      res.status(200).json({ result: "Product deleted successfully", message: product });
    } catch (error) {
      next(error);
    }
  }

  async paginate(req, res, next) {
    const { limit, page, sort, category, available } = req.query;
    let queries = {};

    try {
      //Validation of page number
      if (page) {
        const pageNumber = parseInt(page);
        if (isNaN(pageNumber) || pageNumber <= 0) return CustomError.newError(errors.badRequest, "Invalid page number");
      }

      let options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
      };

      if (category) {
        queries.category = category;
      }

      if (available === "true") {
        queries.stock = { $gt: 0 };
      } else if (available === "false") {
        queries.stock = 0;
      }

      if (sort === "asc") {
        options.sort = { price: 1 };
      } else if (sort === "desc") {
        options.sort = { price: -1 };
      }

      const products = await productService.paginate(queries, options);

      if (parseInt(page) > products.totalPages) return CustomError.newError(errors.badRequest, "Invalid page number");

      const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      const prevLink = products.hasPrevPage
        ? baseUrl.replace(`page=${products.page}`, `page=${products.prevPage}`)
        : null;
      const nextLink = products.hasNextPage
        ? baseUrl.replace(`page=${products.page}`, `page=${products.nextPage}`)
        : null;

      const response = {
        status: "Success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
      };
      res.status(200).send({ response: "ok", message: response });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
