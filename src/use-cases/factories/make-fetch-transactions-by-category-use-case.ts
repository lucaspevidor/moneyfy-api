import { UsersRepository } from "@/repositories/user-repository";
import { FetchTransactionsByCategoryUseCase } from "../fetch-transactions-by-category";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { PrismaTransactionRepository } from "@/repositories/prisma/prisma-transaction-repository";

export function MakeFetchTransactionsByCategoryUseCase(): FetchTransactionsByCategoryUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();
  const transactionRepository: TransactionRepository =
    new PrismaTransactionRepository();

  return new FetchTransactionsByCategoryUseCase(
    usersRepository,
    transactionRepository
  );
}
