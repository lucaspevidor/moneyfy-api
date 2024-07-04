import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeDeleteUserUseCase } from "@/use-cases/factories/make-delete-user-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function DeleteUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    const deleteUserUseCase = MakeDeleteUserUseCase();

    const { userId } = await deleteUserUseCase.execute({
      userId: req.user.sub,
    });

    return reply.status(200).send({ userId });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
