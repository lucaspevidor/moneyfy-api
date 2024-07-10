import { MakeFetchBankAccountUseCase } from "@/use-cases/factories/make-fetch-bank-account-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function FetchBankAccounts(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const fetchBankAccountsUseCase = MakeFetchBankAccountUseCase();
  const { bankAccounts } = await fetchBankAccountsUseCase.execute({
    userId: req.user.sub,
  });

  return reply.status(200).send(bankAccounts);
}
