import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Register user (e2e)", () => {
  beforeAll(async () => await app.ready());

  afterAll(async () => await app.close());

  it("Should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "Lucas",
      email: "lucas@email.com",
      password: "123123",
    });

    expect(response.statusCode).toEqual(201);
  });
});
