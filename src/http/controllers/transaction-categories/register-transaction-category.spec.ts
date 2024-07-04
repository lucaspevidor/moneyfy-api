import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Register transaction category (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should register a transaction", async () => {
    const { token } = await CreateAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/transaction-categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Category 1",
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      name: "Category 1",
      userId: expect.any(String),
      id: expect.any(Number),
    });
  });
});
