import { userService } from "../services/user.service.js";
import { productService } from "../services/product.service.js";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { createHash } from "../utils/hash.functions.js";
import { config } from "../config/config.js";

class DataMock {
  async createUsers(req, res) {
    const { n } = req.params;
    try {
      for (let i = 0; i < n; i++) {
        const first_name = faker.person.firstName().toLowerCase();
        const last_name = faker.person.lastName().toLowerCase();
        const age = Math.floor(Math.random() * (65 - 18 + 1)) + 18;
        const hashPassword = await createHash(config.PASSWORD_USERS_MOCK);

        const data = {
          first_name,
          last_name,
          email: first_name + last_name + "@" + config.MODE + "mail" + ".com",
          age,
          password: hashPassword,
        };

        await userService.createUser(data);
      }
      res.status(201).json({ response: "Users created OK", message: `Total users created: ${n}` });
    } catch (error) {
      res.status(500).json({ response: "Server Error", details: error.message });
    }
  }

  async createProducts(req, res) {
    const { n } = req.params;
    try {
      for (let i = 0; i < n; i++) {
        const title = faker.commerce.product().toLowerCase();
        const description = faker.commerce.productDescription().toLowerCase();
        const price = faker.commerce.price({ min: 100, max: 200 });
        const thumbnail = faker.image.avatar();
        const code = uuidv4();
        const stock = Math.floor(Math.random() * (100 - 20 + 1)) + 18;
        const category = faker.commerce.department();

        const data = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category,
        };
        await productService.create(data);
      }
      res.json({ response: "Products created", message: `Total products created ${n}` });
    } catch (error) {
      res.status(500).json({ response: "Server Error", details: error.message });
    }
  }
}

export const dataMock = new DataMock();
