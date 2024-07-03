import { FastifyInstance } from "fastify";
import { RegisterUser } from "./register";
import { AuthenticateUser } from "./authenticate";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", RegisterUser);
  app.post("/sessions", AuthenticateUser);
}
