import { TransactionRepository } from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { Transaction } from "@prisma/client";

interface FetchTransactionsUseCaseRequest {
  userId: string;
  page: number;
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
  }: FetchTransactionsUseCaseRequest): Promise<FetchTransactionsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new ResourceNotFoundError();

    const transactions = await this.transactionRepository.fetchByUserId(
      userId,
      page
    );

    return { transactions };
  }
}
