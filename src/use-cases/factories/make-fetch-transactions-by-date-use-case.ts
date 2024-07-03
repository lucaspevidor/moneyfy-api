import { UsersRepository } from "@/repositories/user-repository";
import { FetchTransactionsByDateUseCase } from "../fetch-transactions-by-date";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaTransactionRepository } from "@/repositories/prisma/prisma-transaction-repository";

export function MakeFetchTransactionsByDateUseCase(): FetchTransactionsByDateUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();
  const transactionRepository: TransactionRepository =
    new PrismaTransactionRepository();

  return new FetchTransactionsByDateUseCase(
    usersRepository,
    transactionRepository
  );
}
