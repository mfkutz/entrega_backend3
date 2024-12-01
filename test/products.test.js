import { expect } from "chai";
import supertest from "supertest";
import { config } from "../src/config/config.js";
import { productToCreate, userToCreate } from "./data/index.js";
import { requester, registerAndLoginUser, deleteUser, validJWT } from "./testUtils.js";

// const requester = supertest(`http://localhost:${config.PORT}/api`);

// let validJWT;
let productId;
// let userId;

describe("Test Products API's With JWT", () => {
  /*  describe("User Authentication", () => {
    it("Should register a user", async () => {
      const response = await requester.post("/auth/register").send(userToCreate);
      const { _body, statusCode } = response;

      expect(statusCode).to.be.equals(201);
      expect(_body).to.have.property("message", "Registered successfully");

      expect(statusCode).not.to.equal(404);
      expect(_body).not.to.have.property("error", "Unauthorized");
      expect(_body).not.to.have.property("details", "User already exists");
    });

    it("Should log in a user successfully - JWT", async () => {
      let data = { email: "user@test.com", password: "Aa#2345678" };
      const response = await requester.post("/auth/login").send(data);
      const { headers } = response;

      validJWT = headers["set-cookie"][0];

      validJWT = {
        name: validJWT.split("=")[0],
        value: validJWT.split("=")[1].split(";")[0],
      };

      expect(validJWT.name).to.be.equals("token");
      expect(validJWT.value).to.be.ok;

      let current = await requester.get("/auth/current").set("Authorization", `Bearer ${validJWT.value}`);
      const { user } = current._body;
      userId = user._id;
    });
  }); */

  before(async () => {
    await registerAndLoginUser(); // Llama al registro y login una sola vez
  });

  after(async () => {
    await deleteUser(); // Elimina al usuario después de todos los tests
  });

  describe("Product Operations", () => {
    //CREATE //////
    it("Should create a product and return its ID", async () => {
      const res = await requester
        .post("/product")
        .set("Authorization", `Bearer ${validJWT.value}`)
        .send(productToCreate);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("result", "Success");
      expect(res.body.message).to.have.property("_id");

      expect(res.status).not.to.equal(404);

      productId = res.body.message._id;
    });

    //READ (by id) //////
    it("Should return the product corresponding to the specified ID", async () => {
      const res = await requester.get(`/product/${productId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("result", "Product found");
      expect(res.body.product).to.include.all.keys(
        "_id",
        "title",
        "description",
        "price",
        "thumbnail",
        "status",
        "code",
        "stock",
        "category"
      );

      expect(res.status).not.to.equal(404);
    });

    //READ ALL (Paginate) /////
    it("Should retrieve all products with pagination info", async () => {
      const res = await requester.get(`/product`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("response", "ok");

      expect(res.status).not.to.equal(404);
      expect(res.body.message).to.include.all.keys(
        "status",
        "totalPages",
        "prevPage",
        "nextPage",
        "page",
        "hasPrevPage",
        "hasNextPage",
        "prevLink",
        "nextLink"
      );
    });

    //UPDATE //////
    it("Should update the created product successfully", async () => {
      const res = await requester.put(`/product/${productId}`).set("Authorization", `Bearer ${validJWT.value}`).send({
        title: "newTitle",
        price: 300,
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("result", "Product updated successfully");
      expect(res.body.message).to.include.all.keys(
        "_id",
        "title",
        "description",
        "price",
        "thumbnail",
        "status",
        "code",
        "stock",
        "category"
      );

      expect(res.status).not.to.equal(404);
    });

    //  DELETE //////
    it("Should delete the created product successfully", async () => {
      const res = await requester.delete(`/product/${productId}`).set("Authorization", `Bearer ${validJWT.value}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("result", "Product deleted successfully");

      const resCheck = await requester.get(`/product/${productId}`);

      expect(resCheck.status).to.equal(404);
      expect(resCheck.body).to.have.property("message", "Product not found");
    });
  });

  /* describe("User Deletion", () => {
    //DELETE USER TEST
    it("Should delete the user 'user test' successfully' ", async () => {
      const res = await requester.delete(`/user/${userId}`).set("Authorization", `Bearer ${validJWT.value}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "User deleted successfully");

      expect(res.status).not.to.equal(404);
      expect(res.body).not.to.have.property("message", "User not found");

      const resCheck = await requester.get(`/user/${userId}`).set("Authorization", `Bearer ${validJWT.value}`);
      expect(resCheck.status).to.equal(404);
      expect(resCheck.body).to.have.property("message", "User not found");
    });
  }); */
});
