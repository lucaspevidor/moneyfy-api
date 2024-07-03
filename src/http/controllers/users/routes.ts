import { jwtVerify } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { AuthenticateUser } from "./authenticate-user";
import { DeleteUser } from "./delete-user";
import { GetUserProfile } from "./get-user-profile";
import { RegisterUser } from "./register-user";
import { UpdateUser } from "./update-user";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", RegisterUser);
  app.post("/sessions", AuthenticateUser);

  app.get("/profile", { onRequest: [jwtVerify] }, GetUserProfile);
  app.patch("/users", { onRequest: [jwtVerify] }, UpdateUser);
  app.delete("/users", { onRequest: [jwtVerify] }, DeleteUser);
}
