import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Get bank-account (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should get an existing bank account", async () => {
    const { token } = await CreateAndAuthenticateUser(app);

    const accountData = {
      accountName: "Account 1",
      accountCurrency: "BRL",
      initialBalance: 10000,
    };

    const createdResponse = await request(app.server)
      .post("/bank-accounts")
      .set("Authorization", `Bearer ${token}`)
      .send(accountData);

    const { id: accountId } = createdResponse.body;

    const response = await request(app.server)
      .get(`/bank-accounts/${accountId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      id: accountId,
      balance: 10000,
      currency: "BRL",
      name: "Account 1",
      userId: expect.any(String),
    });
  });
});
