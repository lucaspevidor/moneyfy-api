import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InternalServerError } from "./errors/internal-server-error";

interface DeleteTransactionUseCaseRequest {
  userId: string;
  transactionId: string;
}

interface DeleteTransactionUseCaseResponse {
  deletedTransactionId: string;
}

export class DeleteTransactionUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private bankAccountRepository: BankAccountRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute({
    transactionId,
    userId,
  }: DeleteTransactionUseCaseRequest): Promise<DeleteTransactionUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new ResourceNotFoundError();

    const transaction = await this.transactionRepository.getById(transactionId);
    if (!transaction || transaction.userId !== userId)
      throw new ResourceNotFoundError();

    const bankAccount = await this.bankAccountRepository.getById(
      transaction.bankAccountId
    );
    if (!bankAccount || bankAccount.userId !== userId)
      throw new ResourceNotFoundError();

    const result = await this.transactionRepository.delete(transactionId);
    if (!result) throw new InternalServerError();

    let changedAmount = -transaction.amount;
    if (transaction.type === "EXPENSE") changedAmount = transaction.amount;

    await this.bankAccountRepository.update({
      accountId: bankAccount.id,
      data: {
        balance: bankAccount.balance + changedAmount,
      },
    });

    return {
      deletedTransactionId: transaction.id,
    };
  }
}
