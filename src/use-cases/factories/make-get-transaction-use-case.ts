import { PrismaTransactionRepository } from "@/repositories/prisma/prisma-transaction-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetTransactionUseCase } from "../get-transaction";

export async function MakeGetTransactionUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const transactionRepository = new PrismaTransactionRepository();

  return new GetTransactionUseCase(usersRepository, transactionRepository);
}
