import { TransactionRepository } from "@/repositories/transaction-repository";
import { DeleteTransactionUseCase } from "../delete-transaction";
import { PrismaTransactionRepository } from "@/repositories/prisma/prisma-transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { PrismaBankAccountRepository } from "@/repositories/prisma/prisma-bank-account-repository";

export function MakeDeleteTransactionUseCase(): DeleteTransactionUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();
  const bankAccountRepository: BankAccountRepository =
    new PrismaBankAccountRepository();
  const transactionRepository: TransactionRepository =
    new PrismaTransactionRepository();

  return new DeleteTransactionUseCase(
    usersRepository,
    bankAccountRepository,
    transactionRepository
  );
}
