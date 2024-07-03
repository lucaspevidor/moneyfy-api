import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { PrismaBankAccountRepository } from "@/repositories/prisma/prisma-bank-account-repository";
import { PrismaTransactionCategoryRepository } from "@/repositories/prisma/prisma-transaction-category-repository";
import { PrismaTransactionRepository } from "@/repositories/prisma/prisma-transaction-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { RegisterTransactionUseCase } from "../register-transaction";

export function MakeRegisterTransactionUseCase(): RegisterTransactionUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();
  const transactionRepository: TransactionRepository =
    new PrismaTransactionRepository();
  const bankAccountRepository: BankAccountRepository =
    new PrismaBankAccountRepository();
  const transactionCategoryRepository: TransactionCategoryRepository =
    new PrismaTransactionCategoryRepository();

  return new RegisterTransactionUseCase(
    usersRepository,
    bankAccountRepository,
    transactionRepository,
    transactionCategoryRepository
  );
}
