import { expect } from "chai";
import supertest from "supertest";
import { config } from "../src/config/config.js";
import jwt from "jsonwebtoken";
import { userService } from "../src/services/user.service.js";

const requester = supertest(`http://localhost:${config.PORT}/api`);

// JWT que se utilizará en las pruebas
let validJWT;
const secretKey = config.JWT_SECRET;
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
    console.log("ver aqui", response);
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* before(async () => {
    // Realizamos un login con un usuario preexistente
    const loginData = {
      email: "admin@gmail.com", // Usuario existente
      password: "Aa#2345678", // Contraseña del usuario
    };

    // Petición al endpoint de login
    const loginResponse = await requester.post("/auth/login").send(loginData);

    // Verificamos que la respuesta tenga un status de 200 y el JWT
    expect(loginResponse.status).to.equal(200);
    expect(loginResponse.body).to.have.property("token");

    // Guardamos el JWT para usarlo en la prueba de creación de producto
    validJWT = loginResponse.body.token;
  });
 */

  /* it("Debería crear un producto y devolver el ID", async () => {
    const res = await requester.post("/product").set("Authorization", `Bearer ${validJWT}`).send(productToCreate);

    // Verificamos la respuesta
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("result", "Product created successfully");
    expect(res.body.product).to.have.property("_id");

    // Guardamos el ID del producto para futuras pruebas si es necesario
    productId = res.body.product._id;
  }); */
});
