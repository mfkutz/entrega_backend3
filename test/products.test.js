import { expect } from "chai";
import supertest from "supertest";
import { config } from "../src/config/config.js";

const requester = supertest(`http://localhost:${config.PORT}/api`);

// JWT que se utilizará en las pruebas
let validJWT;
let productId;
let userId;

describe("Test Product API With JWT", () => {
  //creating product
  let productToCreate = {
    title: "Product121",
    description: "Descripcion121",
    price: 250,
    thumbnail: "picture121.png",
    code: "C012",
    stock: 20,
    category: "cat1",
  };

  it("Debe registrar un usuario", async () => {
    let data = {
      first_name: "user",
      last_name: "test",
      email: "user@test.com",
      age: "23",
      password: "Aa#2345678",
      role: "admin",
    };

    const response = await requester.post("/auth/register").send(data);
    const { _body, statusCode } = response;

    expect(statusCode).to.be.equals(201);
    expect(_body).to.have.property("message", "Registered successfully");
  });

  it("Debe iniciar sesión un usuario", async () => {
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

  it("Debería crear un producto y devolver el ID", async () => {
    const res = await requester.post("/product").set("Authorization", `Bearer ${validJWT.value}`).send(productToCreate);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("result", "Success");
    expect(res.body.message).to.have.property("_id");

    productId = res.body.message._id;
  });

  it("Debería devolver el producto correspondiente al ID especificado", async () => {
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
  });

  ///////  CLEANING DATA ///////////////////
  it("Deberia eliminar producto recien creado", async () => {
    const res = await requester.delete(`/product/${productId}`).set("Authorization", `Bearer ${validJWT.value}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("result", "Product deleted successfully");

    const resCheck = await requester.get(`/product/${productId}`);

    expect(resCheck.status).to.equal(404);
    expect(resCheck.body).to.have.property("message", "Product not found");
  });

  it("Deberia eliminar el usuario user-test", async () => {
    const res = await requester.delete(`/user/${userId}`).set("Authorization", `Bearer ${validJWT.value}`);
  });
});
