import { prisma } from "@/lib/prisma";
import { $Enums, Prisma, Transaction } from "@prisma/client";
import {
  FetchByUserIdAndDateParams,
  FetchByUserIdAndTransactionCategoryIdParams,
  TransactionFilterType,
  TransactionRepository,
  TransactionUpdateParams,
} from "../transaction-repository";

export class PrismaTransactionRepository implements TransactionRepository {
  async create(
    data: Prisma.TransactionUncheckedCreateInput
  ): Promise<Transaction> {
    const createdTransaction = await prisma.transaction.create({
      data,
    });

    return createdTransaction;
  }
  async getById(transactionId: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    return transaction;
  }
  async fetchByUserId(
    userId: string,
    page: number,
    transactionType: TransactionFilterType
  ): Promise<Transaction[]> {
    const filter: Partial<
      Pick<
        Prisma.TransactionUncheckedCreateInput,
        "userId" | "categoryId" | "type"
      >
    > = {
      userId,
    };

    if (transactionType === TransactionFilterType.EXPENSES)
      filter.type = "EXPENSE";
    if (transactionType === TransactionFilterType.INCOMES)
      filter.type = "INCOME";

    const transactions = await prisma.transaction.findMany({
      where: filter,
      orderBy: {
        date: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return transactions;
  }
  async fetchByUserIdAndTransactionCategoryId(
    data: FetchByUserIdAndTransactionCategoryIdParams
  ): Promise<Transaction[]> {
    const { categoryId, page, transactionType, userId } = data;

    const filter: Partial<
      Pick<
        Prisma.TransactionUncheckedCreateInput,
        "userId" | "categoryId" | "type"
      >
    > = {
      userId,
      categoryId,
    };

    if (transactionType === TransactionFilterType.EXPENSES)
      filter.type = "EXPENSE";
    if (transactionType === TransactionFilterType.INCOMES)
      filter.type = "INCOME";

    const transactions = await prisma.transaction.findMany({
      where: filter,
      orderBy: {
        date: "desc",
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    return transactions;
  }
  async fetchByUserIdAndDate(
    data: FetchByUserIdAndDateParams
  ): Promise<Transaction[]> {
    const { dateFrom, dateTo, page, transactionType, userId } = data;

    let type: $Enums.TransactionType | undefined = undefined;
    if (transactionType === TransactionFilterType.EXPENSES) type = "EXPENSE";
    if (transactionType === TransactionFilterType.INCOMES) type = "INCOME";

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type,
        date: {
          gt: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return transactions;
  }
  async update(data: TransactionUpdateParams): Promise<Transaction> {
    const { transactionId, updatedData } = data;

    const updatedTransaction = await prisma.transaction.update({
      data: updatedData,
      where: {
        id: transactionId,
      },
    });

    return updatedTransaction;
  }
  async delete(transactionId: string): Promise<string | null> {
    const deletedTransaction = await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    return deletedTransaction.id;
  }
}
