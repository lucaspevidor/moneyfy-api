import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { Prisma, Transaction } from "@prisma/client";
import { InvalidTransactionAmountError } from "./errors/invalid-transaction-amount-error";
import { InvalidCurrencyError } from "./errors/invalid-currency-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";

interface RegisterTransactionUseCaseRequest {
  transaction: Prisma.TransactionUncheckedCreateInput;
}

interface RegisterTransactionUseCaseResponse {
  createdTransaction: Transaction;
}

export class RegisterTransactionUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private bankAccountRepository: BankAccountRepository,
    private transactionRepository: TransactionRepository,
    private transactionCategoryRepository: TransactionCategoryRepository
  ) {}

  async execute({
    transaction,
  }: RegisterTransactionUseCaseRequest): Promise<RegisterTransactionUseCaseResponse> {
    const {
      amount,
      bankAccountId,
      categoryId,
      currency,
      date,
      description,
      type,
      userId,
    } = transaction;

    if (amount <= 0) throw new InvalidTransactionAmountError();

    const bankAccount = await this.bankAccountRepository.getById(bankAccountId);
    if (!bankAccount || bankAccount.userId !== userId)
      throw new ResourceNotFoundError();
    if (currency === "" || currency !== bankAccount.currency)
      throw new InvalidCurrencyError();

    const category = await this.transactionCategoryRepository.getById(
      categoryId
    );
    if (!category || category.userId !== userId)
      throw new ResourceNotFoundError();

    const user = await this.usersRepository.findById(userId);
    if (!user) throw new ResourceNotFoundError();

    const createdTransaction = await this.transactionRepository.create({
      amount,
      bankAccountId,
      categoryId,
      currency,
      date,
      description,
      type,
      userId,
    });

    let changeAmount = createdTransaction.amount;
    if (createdTransaction.type === "EXPENSE") changeAmount *= -1;

    await this.bankAccountRepository.update({
      accountId: bankAccount.id,
      data: {
        balance: bankAccount.balance + changeAmount,
      },
    });

    return { createdTransaction };
  }
}
