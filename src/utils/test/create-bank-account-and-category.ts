import { FastifyInstance } from "fastify";
import request from "supertest";
import { CreateAndAuthenticateUser } from "./create-and-authenticate-user";

export async function CreateBankAccountAndCategory(app: FastifyInstance) {
  const userData = await CreateAndAuthenticateUser(app);

  const bankAccountData = {
    accountName: "Account 1",
    accountCurrency: "BRL",
    initialBalance: 10000,
  };

  const bankAccountResponse = await request(app.server)
    .post("/bank-accounts")
    .set("Authorization", `Bearer ${userData.token}`)
    .send(bankAccountData);

  const transactionCategoryData = {
    name: "Car",
  };

  const transactionCategoryResponse = await request(app.server)
    .post("/transaction-categories")
    .set("Authorization", `Bearer ${userData.token}`)
    .send(transactionCategoryData);

  return {
    user: userData,
    bankAccount: bankAccountResponse.body,
    transactionCategory: transactionCategoryResponse.body,
  };
}
