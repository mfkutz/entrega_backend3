import supertest from "supertest";
import { config } from "../src/config/config.js";
import { userToCreate } from "./data/index.js";

const requester = supertest(`http://localhost:${config.PORT}/api`);

let validJWT;
let userId;
let cartId;

async function registerAndLoginUser() {
  const registerResponse = await requester.post("/auth/register").send(userToCreate);
  const loginData = { email: userToCreate.email, password: userToCreate.password };
  const loginResponse = await requester.post("/auth/login").send(loginData);

  const { headers } = loginResponse;
  validJWT = headers["set-cookie"][0];

  validJWT = {
    name: validJWT.split("=")[0],
    value: validJWT.split("=")[1].split(";")[0],
  };

  const currentUserResponse = await requester.get("/auth/current").set("Authorization", `Bearer ${validJWT.value}`);

  userId = currentUserResponse._body.user._id;
  cartId = currentUserResponse._body.user.cart;
}

async function deleteUser() {
  await requester.delete(`/user/${userId}`).set("Authorization", `Bearer ${validJWT.value}`);
}

export { requester, registerAndLoginUser, deleteUser, validJWT, userId, cartId };
