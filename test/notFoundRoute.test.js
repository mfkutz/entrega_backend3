import { expect } from "chai";
import { requester } from "./testUtils.js";

describe("404 - Route Not Found", () => {
  it("Should return a 404 status with an error message", async () => {
    const res = await requester.get("/non-existent-route");
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error").that.equal("Route not found");
    expect(res.body).to.have.property("message").that.equal("The route you are looking for does not exist");
  });
});
