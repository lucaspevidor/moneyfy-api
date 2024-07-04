import { jwtVerify } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { DeleteTransactionCategory } from "./delete-transaction-category";
import { FetchTransactionCategories } from "./fetch-transaction-categories";
import { RegisterTransactionCategory } from "./register-transaction-category";
import { UpdateTransactionCategory } from "./update-transaction-category";

export async function transactionCategoryRoutes(app: FastifyInstance) {
  app.addHook("onRequest", jwtVerify);

  app.get("/transaction-categories", FetchTransactionCategories);
  app.post("/transaction-categories", RegisterTransactionCategory);
  app.patch("/transaction-categories", UpdateTransactionCategory);
  app.delete("/transaction-categories", DeleteTransactionCategory);
}
