import fastify from "fastify";

import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";

import { routes } from "@/routes";
import { env } from "./env";

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

app.setErrorHandler((error, request, reply) => {
  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // Send to data app
  }

  return reply.status(500).send({ message: "Internal server error." });
});

export { app };
