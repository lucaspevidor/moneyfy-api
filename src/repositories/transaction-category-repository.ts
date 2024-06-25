import { TransactionCategory, Prisma } from "@prisma/client";

export interface TransactionCategoryUpdateParams {
  categoryId: number;
  updatedData: Partial<
    Pick<Prisma.TransactionCategoryUncheckedCreateInput, "name">
  >;
}

export interface TransactionCategoryRepository {
  create(
    data: Prisma.TransactionCategoryUncheckedCreateInput
  ): Promise<TransactionCategory>;
  getById(categoryId: number): Promise<TransactionCategory | null>;
  fetchByUserId(userId: string): Promise<TransactionCategory[]>;
  update(data: TransactionCategoryUpdateParams): Promise<TransactionCategory>;
  delete(categoryId: number): Promise<number>;
}
