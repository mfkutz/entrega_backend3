import { expect } from "chai";
import { productTest } from "./data/index.js";
import { requester, registerAndLoginUser, deleteUser, validJWT } from "./testUtils.js";

let idNewCart;
let idProduct;

describe("Test Carts API's With JWT", async () => {
  before(async () => {
    await registerAndLoginUser();
  });

  after(async () => {
    await deleteUser();
  });

  describe("Cart Operations", () => {
    it("Should create a new cart and return its ID", async () => {
      const res = await requester.post(`/cart`).set("Authorization", `Bearer ${validJWT.value}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("result", "success");

      idNewCart = res.body.cart._id;
    });

    it("Should get all carts", async () => {
      const res = await requester.get(`/cart`).set("Authorization", `Bearer ${validJWT.value}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("result", "success");

      expect(res.status).not.to.equal(404);
    });

    it("Should get cart from ID", async () => {
      const res = await requester.get(`/cart/${idNewCart}`).set("Authorization", `Bearer ${validJWT.value}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("response", "success");
      expect(res.body.cart).to.have.property("_id");

      expect(res.status).not.to.equal(404);
    });

    describe("Create product for tests", () => {
      it("Should create product", async () => {
        const res = await requester.post("/product").set("Authorization", `Bearer ${validJWT.value}`).send(productTest);
        expect(res.status).to.equal(201);
        idProduct = res.body.message._id;
      });

      it("Should add product to cart", async () => {
        const res = await requester
          .post(`/cart/${idNewCart}/product/${idProduct}`)
          .set("Authorization", `Bearer ${validJWT.value}`)
          .send({ quantity: 1 });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("result", "Success");

        expect(res.status).not.to.equal(404);
      });

      it("Should modify quantity of product", async () => {
        const res = await requester
          .put(`/cart/${idNewCart}/product/${idProduct}`)
          .set("Authorization", `Bearer ${validJWT.value}`)
          .send({ quantity: 2 });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("result", "Success");

        expect(res.status).not.to.equal(404);
      });
    });

    describe("Delete product after use", () => {
      it("Delete prodduct created for test", async () => {
        const res = await requester.delete(`/product/${idProduct}`).set("Authorization", `Bearer ${validJWT.value}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("result", "Product deleted successfully");
      });
    });
  });
});