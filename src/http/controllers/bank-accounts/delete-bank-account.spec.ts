import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Delete bank-account (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should delete an existing bank account", async () => {
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
      .delete(`/bank-accounts/${accountId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      deletedBankAccountId: accountId,
    });
  });
});
