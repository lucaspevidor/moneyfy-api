import { Prisma, TransactionCategory } from "@prisma/client";
import {
  TransactionCategoryRepository,
  TransactionCategoryUpdateParams,
} from "../transaction-category-repository";
import { prisma } from "@/lib/prisma";

export class PrismaTransactionCategoryRepository
  implements TransactionCategoryRepository
{
  async create(
    data: Prisma.TransactionCategoryUncheckedCreateInput
  ): Promise<TransactionCategory> {
    const createdCategory = await prisma.transactionCategory.create({
      data,
    });

    return createdCategory;
  }

  async getById(categoryId: number): Promise<TransactionCategory | null> {
    const category = await prisma.transactionCategory.findUnique({
      where: {
        id: categoryId,
      },
    });

    return category;
  }
  async fetchByUserId(userId: string): Promise<TransactionCategory[]> {
    const categories = await prisma.transactionCategory.findMany({
      where: {
        userId,
      },
    });

    return categories;
  }
  async update(
    data: TransactionCategoryUpdateParams
  ): Promise<TransactionCategory> {
    const { categoryId, updatedData } = data;

    const updatedCategory = await prisma.transactionCategory.update({
      data: updatedData,
      where: {
        id: categoryId,
      },
    });

    return updatedCategory;
  }
  async delete(categoryId: number): Promise<number> {
    const deletedCategory = await prisma.transactionCategory.delete({
      where: {
        id: categoryId,
      },
    });

    return deletedCategory.id;
  }
}
