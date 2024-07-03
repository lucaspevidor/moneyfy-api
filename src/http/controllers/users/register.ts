import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { MakeRegisterUserUseCase } from "@/use-cases/factories/make-register-user-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function RegisterUser(req: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  try {
    const registerUserUseCase = MakeRegisterUserUseCase();

    await registerUserUseCase.execute({
      name,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
