import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Register bank-account (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should register a bank account", async () => {
    const { token } = await CreateAndAuthenticateUser(app);

    const accountData = {
      accountName: "Account 1",
      accountCurrency: "BRL",
      initialBalance: 10000,
    };

    const response = await request(app.server)
      .post("/bank-accounts")
      .set("Authorization", `Bearer ${token}`)
      .send(accountData);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      balance: 10000,
      currency: "BRL",
      name: "Account 1",
      userId: expect.any(String),
    });
  });
});
