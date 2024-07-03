import { PrismaTransactionRepository } from "@/repositories/prisma/prisma-transaction-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";

import { FetchTransactionsUseCase } from "../fetch-transactions";

export function MakeFetchTransactionsUseCase(): FetchTransactionsUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();
  const transactionRepository: TransactionRepository =
    new PrismaTransactionRepository();

  return new FetchTransactionsUseCase(usersRepository, transactionRepository);
}
