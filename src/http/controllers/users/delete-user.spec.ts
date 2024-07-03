import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Delete user (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should be able to delete an existing user", async () => {
    const { token, email, password } = await CreateAndAuthenticateUser(app);

    const response = await request(app.server)
      .delete("/users")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      userId: expect.any(String),
    });

    const newSession = await request(app.server)
      .post("/sessions")
      .send({ email, password });

    expect(newSession.statusCode).toEqual(400);
  });
});
