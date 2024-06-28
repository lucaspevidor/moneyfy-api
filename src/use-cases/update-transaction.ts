import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { Prisma, Transaction, TransactionCategory } from "@prisma/client";
import { InvalidTransactionAmountError } from "./errors/invalid-transaction-amount-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";
import { InternalServerError } from "./errors/internal-server-error";

interface UpdateTransactionUseCaseRequest {
  transactionId: string;
  userId: string;
  updatedData: Partial<
    Pick<
      Prisma.TransactionUncheckedCreateInput,
      "amount" | "categoryId" | "date" | "description" | "type"
    >
  >;
}

interface UpdateTransactionUseCaseResponse {
  updatedTransaction: Transaction;
}

export class UpdateTransactionUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private bankAccountRepository: BankAccountRepository,
    private transactionRepository: TransactionRepository,
    private transactionCategoryRepository: TransactionCategoryRepository
  ) {}

  async execute({
    transactionId,
    updatedData,
    userId,
  }: UpdateTransactionUseCaseRequest): Promise<UpdateTransactionUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new ResourceNotFoundError();

    const transaction = await this.transactionRepository.getById(transactionId);
    if (!transaction || transaction.userId !== userId)
      throw new ResourceNotFoundError();

    let category: TransactionCategory | undefined | null = undefined;
    if (updatedData.categoryId) {
      category = await this.transactionCategoryRepository.getById(
        updatedData.categoryId
      );
      if (!category || category.userId !== userId)
        throw new ResourceNotFoundError();
    }

    if (updatedData.amount !== undefined && updatedData.amount <= 0) {
      throw new InvalidTransactionAmountError();
    }

    let bankAccount = await this.bankAccountRepository.getById(
      transaction.bankAccountId
    );
    if (!bankAccount || bankAccount.userId !== userId)
      throw new InternalServerError();

    let reverseAmount = transaction.amount;
    if (transaction.type === "INCOME") reverseAmount *= -1;

    bankAccount = await this.bankAccountRepository.update({
      accountId: bankAccount.id,
      data: {
        balance: bankAccount.balance + reverseAmount,
      },
    });

    if (updatedData.amount) transaction.amount = updatedData.amount;
    if (updatedData.categoryId) transaction.categoryId = updatedData.categoryId;
    if (updatedData.date) transaction.date = new Date(updatedData.date);
    if (updatedData.description)
      transaction.description = updatedData.description;
    if (updatedData.type) transaction.type = updatedData.type;

    let changeAmount = transaction.amount;
    if (transaction.type === "EXPENSE") changeAmount *= -1;

    await this.bankAccountRepository.update({
      accountId: bankAccount.id,
      data: {
        balance: bankAccount.balance + changeAmount,
      },
    });

    const updatedTransaction = await this.transactionRepository.update({
      transactionId: transactionId,
      updatedData,
    });

    return { updatedTransaction };
  }
}
