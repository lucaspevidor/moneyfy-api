import { describe, beforeAll, afterAll, it, expect } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Authenticate user (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should authenticate an user", async () => {
    await request(app.server).post("/users").send({
      name: "Lucas",
      email: "lucas@email.com",
      password: "123123",
    });

    const response = await request(app.server).post("/sessions").send({
      email: "lucas@email.com",
      password: "123123",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });
});
