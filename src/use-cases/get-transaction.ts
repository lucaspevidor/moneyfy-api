import { TransactionRepository } from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { Transaction } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetTransactionUseCaseRequest {
  userId: string;
  transactionId: string;
}

interface GetTransactionUseCaseResponse {
  transaction: Transaction;
}

export class GetTransactionUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute({
    transactionId,
    userId,
  }: GetTransactionUseCaseRequest): Promise<GetTransactionUseCaseResponse> {
    const transaction = await this.transactionRepository.getById(transactionId);
    if (!transaction || transaction.userId !== userId)
      throw new ResourceNotFoundError();

    return { transaction };
  }
}
