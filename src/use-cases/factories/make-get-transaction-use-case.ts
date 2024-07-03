import { PrismaTransactionRepository } from "@/repositories/prisma/prisma-transaction-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { GetTransactionUseCase } from "../get-transaction";

export async function MakeGetTransactionUseCase() {
  const usersRepository: UsersRepository = new PrismaUsersRepository();
  const transactionRepository: TransactionRepository =
    new PrismaTransactionRepository();

  return new GetTransactionUseCase(usersRepository, transactionRepository);
}
