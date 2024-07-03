import { FastifyInstance } from "fastify";
import request from "supertest";

export async function CreateAndAuthenticateUser(app: FastifyInstance) {
  const user = {
    name: "Lucas",
    email: "lucas@email.com",
    password: "123123",
  };
  await request(app.server).post("/users").send(user);

  const response = await request(app.server).post("/sessions").send({
    email: "lucas@email.com",
    password: "123123",
  });

  const { token } = response.body;

  return { token, ...user };
}
