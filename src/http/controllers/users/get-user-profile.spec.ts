import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Get user profile (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should be able to get the user profile", async () => {
    const { email, name, token } = await CreateAndAuthenticateUser(app);

    const response = await request(app.server)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      email,
      name,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(response.body.password).toBeUndefined();
  });
});
