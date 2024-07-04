import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeGetUserUseCase } from "@/use-cases/factories/make-get-user-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function GetUserProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserUseCase = MakeGetUserUseCase();
    const { user } = await getUserUseCase.execute({
      userId: req.user.sub,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pwdHash, ...userWithoutPass } = user;

    return reply.status(200).send(userWithoutPass);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
