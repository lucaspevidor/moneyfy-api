import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Update user (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should be able to update an existing user", async () => {
    const { token } = await CreateAndAuthenticateUser(app);

    const newUserData = {
      name: "Mateus",
      email: "mateus@email.com",
      password: "123456",
    };

    const response = await request(app.server)
      .patch("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...newUserData,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: newUserData.name,
      email: newUserData.email,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
    });

    const newSession = await request(app.server).post("/sessions").send({
      email: newUserData.email,
      password: newUserData.password,
    });

    expect(newSession.statusCode).toEqual(200);
  });
});
