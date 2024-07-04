import fastify from "fastify";

import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";

import { routes } from "@/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { transactionCategoryRoutes } from "./http/controllers/transaction-categories/routes";
import { usersRoutes } from "./http/controllers/users/routes";

const app = fastify();

app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(cookie);

app.register(routes);
app.register(usersRoutes);
app.register(transactionCategoryRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // Send to data app
  }

  return reply.status(500).send({ message: "Internal server error." });
});

export { app };
