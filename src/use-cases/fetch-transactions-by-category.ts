import {
  TransactionFilterType,
  TransactionRepository,
} from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { Transaction } from "@prisma/client";

interface FetchTransactionsByCategoryUseCaseRequest {
  userId: string;
  categoryId: number;
  transactionType: TransactionFilterType;
  page: number;
}

interface FetchTransactionsByCategoryUseCaseResponse {
  transactions: Transaction[];
}

export class FetchTransactionsByCategoryUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute({
    userId,
    categoryId,
    transactionType,
    page,
  }: FetchTransactionsByCategoryUseCaseRequest): Promise<FetchTransactionsByCategoryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new ResourceNotFoundError();

    const transactions =
      await this.transactionRepository.fetchByUserIdAndTransactionCategoryId({
        userId,
        categoryId,
        transactionType,
        page,
      });

    return { transactions };
  }
}
