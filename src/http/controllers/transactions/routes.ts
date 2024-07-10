import { jwtVerify } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { DeleteTransaction } from "./delete-transaction";
import { FetchTransactions } from "./fetch-transactions";
import { GetTransaction } from "./get-transaction";
import { RegisterTransaction } from "./register-transaction";
import { UpdateTransaction } from "./update-transaction";

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook("onRequest", jwtVerify);

  app.get("/transactions/:transactionId", GetTransaction);
  app.get("/transactions", FetchTransactions);
  app.post("/transactions", RegisterTransaction);
  app.patch("/transactions/:transactionId", UpdateTransaction);
  app.delete("/transactions/:transactionId", DeleteTransaction);
}
