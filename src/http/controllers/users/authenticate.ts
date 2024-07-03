import { InvalidCredentialError } from "@/use-cases/errors/invalid-credentials-error";
import { MakeAuthenticateUserUseCase } from "@/use-cases/factories/make-authenticate-user-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function AuthenticateUser(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(req.body);

  try {
    const authenticateUserUseCase = MakeAuthenticateUserUseCase();

    const { user } = await authenticateUserUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      }
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
