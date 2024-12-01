import { expect } from "chai";
import { productToCreate } from "./data/index.js";
import { requester, registerAndLoginUser, deleteUser, validJWT } from "./testUtils.js";

let productId;

describe("Test Products API's With JWT", () => {
  before(async () => {
    await registerAndLoginUser();
  });

  after(async () => {
    await deleteUser();
  });

  describe("Product Operations", () => {
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

    it("Should delete the created product successfully", async () => {
      const res = await requester.delete(`/product/${productId}`).set("Authorization", `Bearer ${validJWT.value}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("result", "Product deleted successfully");

      const resCheck = await requester.get(`/product/${productId}`);

      expect(resCheck.status).to.equal(404);
      expect(resCheck.body).to.have.property("message", "Product not found");
    });
  });
});
