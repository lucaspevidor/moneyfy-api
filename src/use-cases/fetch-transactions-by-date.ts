import {
  TransactionFilterType,
  TransactionRepository,
} from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { Transaction } from "@prisma/client";
import dayjs from "dayjs";
import { InvalidDateError } from "./errors/invalid-date-error";

interface FetchTransactionsByDateUseCaseRequest {
  userId: string;
  dateFrom: Date;
  dateTo: Date;
  transactionType: TransactionFilterType;
  page: number;
}

interface FetchTransactionsByDateUseCaseResponse {
  transactions: Transaction[];
}

export class FetchTransactionsByDateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute({
    userId,
    dateFrom,
    dateTo,
    transactionType,
    page,
  }: FetchTransactionsByDateUseCaseRequest): Promise<FetchTransactionsByDateUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new ResourceNotFoundError();

    if (dayjs(dateFrom).isAfter(dateTo)) throw new InvalidDateError();

    const transactions = await this.transactionRepository.fetchByUserIdAndDate({
      dateFrom,
      dateTo,
      page,
      transactionType,
      userId,
    });

    return { transactions };
  }
}
