import { FastifyInstance, FastifyReply } from "fastify";

async function routes(fastify: FastifyInstance) {
  fastify.get("/", async (_, reply: FastifyReply) => {
    reply.status(200).send({ message: "Hello, world!" });
  });
}

export { routes };
