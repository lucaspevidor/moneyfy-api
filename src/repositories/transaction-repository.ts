import { Prisma, Transaction } from "@prisma/client";

export enum TransactionFilterType {
  INCOMES,
  EXPENSES,
  INCOMES_AND_EXPENSES,
}

export interface TransactionUpdateParams {
  transactionId: string;
  updatedData: Partial<
    Pick<
      Prisma.TransactionUncheckedCreateInput,
      "amount" | "categoryId" | "date" | "description" | "type"
    >
  >;
}

export interface FetchByUserIdAndTransactionCategoryIdParams {
  userId: string;
  categoryId: number;
  transactionType: TransactionFilterType;
  page: number;
}

export interface FetchByUserIdAndDateParams {
  userId: string;
  dateFrom: Date;
  dateTo: Date;
  transactionType: TransactionFilterType;
  page: number;
}

export interface TransactionRepository {
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>;
  getById(transactionId: string): Promise<Transaction | null>;
  fetchByUserId(
    userId: string,
    page: number,
    transactionType: TransactionFilterType
  ): Promise<Transaction[]>;
  fetchByUserIdAndTransactionCategoryId(
    data: FetchByUserIdAndTransactionCategoryIdParams
  ): Promise<Transaction[]>;
  fetchByUserIdAndDate(
    data: FetchByUserIdAndDateParams
  ): Promise<Transaction[]>;
  update(data: TransactionUpdateParams): Promise<Transaction>;
  delete(transactionId: string): Promise<string | null>;
}
