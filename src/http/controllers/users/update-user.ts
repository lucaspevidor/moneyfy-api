import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeUpdateUserUseCase } from "@/use-cases/factories/make-update-user-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function UpdateUser(req: FastifyRequest, reply: FastifyReply) {
  const updateUserBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  });

  const { name, email, password } = updateUserBodySchema.parse(req.body);

  try {
    const updateUserUseCase = MakeUpdateUserUseCase();

    const { user: updatedUser } = await updateUserUseCase.execute({
      id: req.user.sub,
      email,
      name,
      password,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pwdHash, ...userWithoutPassword } = updatedUser;

    return reply.status(200).send(userWithoutPassword);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
