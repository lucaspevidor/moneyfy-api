import { Prisma, Transaction } from "@prisma/client";
import {
  FetchByUserIdAndDateParams,
  FetchByUserIdAndTransactionCategoryIdParams,
  TransactionFilterType,
  TransactionRepository,
} from "../transaction-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryTransactionRepository implements TransactionRepository {
  public Transactions: Transaction[] = [];

  async create(
    data: Prisma.TransactionUncheckedCreateInput
  ): Promise<Transaction> {
    const transaction: Transaction = {
      id: randomUUID(),
      amount: data.amount,
      bankAccountId: data.bankAccountId,
      categoryId: data.categoryId,
      currency: data.currency,
      date: new Date(data.date),
      description: data.description,
      type: data.type,
      userId: data.userId,
    };

    this.Transactions.push(transaction);

    return transaction;
  }
  async getById(transactionId: string): Promise<Transaction | null> {
    const transaction = this.Transactions.find((t) => t.id === transactionId);

    if (!transaction) return null;

    return transaction;
  }

  async fetchByUserId(userId: string, page: number): Promise<Transaction[]> {
    const transactions = this.Transactions.filter((t) => t.userId === userId);
    return transactions.slice((page - 1) * 20, page * 20);
  }

  async fetchByUserIdAndTransactionCategoryId(
    data: FetchByUserIdAndTransactionCategoryIdParams
  ): Promise<Transaction[]> {
    const { categoryId, page, transactionType, userId } = data;

    let transactions = this.Transactions.filter(
      (t) => t.userId === userId && t.categoryId === categoryId
    );

    if (transactionType === TransactionFilterType.INCOMES) {
      transactions = transactions.filter((t) => t.type === "INCOME");
    } else if (transactionType === TransactionFilterType.EXPENSES) {
      transactions = transactions.filter((t) => t.type === "EXPENSE");
    }

    return transactions.slice((page - 1) * 20, page * 20);
  }

  async fetchByUserIdAndDate(
    data: FetchByUserIdAndDateParams
  ): Promise<Transaction[]> {
    const { dateFrom, dateTo, page, transactionType, userId } = data;

    const dateFromFmt = dayjs(dateFrom).startOf("date");
    const dateToFmt = dayjs(dateTo).endOf("date");

    let transactions = this.Transactions.filter(
      (t) =>
        t.userId === userId &&
        dayjs(t.date).isAfter(dateFromFmt) &&
        dayjs(t.date).isBefore(dateToFmt)
    );

    if (transactionType === TransactionFilterType.INCOMES) {
      transactions = transactions.filter((t) => t.type === "INCOME");
    } else if (transactionType === TransactionFilterType.EXPENSES) {
      transactions = transactions.filter((t) => t.type === "EXPENSE");
    }

    return transactions.slice((page - 1) * 20, page * 20);
  }

  async delete(transactionId: string): Promise<string | null> {
    const transactionIndex = this.Transactions.findIndex(
      (t) => t.id === transactionId
    );

    if (transactionIndex === -1) return null;

    this.Transactions.splice(transactionIndex, 1);

    return transactionId;
  }
}
