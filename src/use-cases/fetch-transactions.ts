import {
  TransactionFilterType,
  TransactionRepository,
} from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { Transaction } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchTransactionsUseCaseRequest {
  userId: string;
  page: number;
  transactionType: TransactionFilterType;
}

interface FetchTransactionsUseCaseResponse {
  transactions: Transaction[];
}

export class FetchTransactionsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute({
    userId,
    page,
    transactionType,
  }: FetchTransactionsUseCaseRequest): Promise<FetchTransactionsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new ResourceNotFoundError();

    const transactions = await this.transactionRepository.fetchByUserId(
      userId,
      page,
      transactionType
    );

    return { transactions };
  }
}
