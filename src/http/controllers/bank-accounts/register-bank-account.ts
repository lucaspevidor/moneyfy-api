import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeRegisterBankAccountUseCase } from "@/use-cases/factories/make-register-bank-account-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function RegisterBankAccount(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const registerBankAccountSchema = z.object({
    accountName: z.string().min(3),
    accountCurrency: z.string(),
    initialBalance: z.number(),
  });

  const { accountCurrency, accountName, initialBalance } =
    registerBankAccountSchema.parse(req.body);

  try {
    const registerBankAccountUseCase = MakeRegisterBankAccountUseCase();

    const { bankAccount } = await registerBankAccountUseCase.execute({
      balance: initialBalance,
      currency: accountCurrency,
      name: accountName,
      userId: req.user.sub,
    });

    return reply.status(201).send(bankAccount);
  } catch (err) {
    if (err instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: err.message });

    throw err;
  }
}
