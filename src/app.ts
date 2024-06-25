import fastify from "fastify";

import { routes } from "@/routes";
import { env } from "./env";

const app = fastify();

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
