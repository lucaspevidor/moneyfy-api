import {
  TransactionCategoryRepository,
  TransactionCategoryUpdateParams,
} from "../transaction-category-repository";
import { Prisma, TransactionCategory } from "@prisma/client";

export class InMemoryTransactionCategoryRepository
  implements TransactionCategoryRepository
{
  Categories: TransactionCategory[] = [];
  CategoryIndex = 0;

  async create(
    data: Prisma.TransactionCategoryUncheckedCreateInput
  ): Promise<TransactionCategory> {
    const category: TransactionCategory = {
      id: this.CategoryIndex,
      name: data.name,
      userId: data.userId,
    };

    this.CategoryIndex++;
    this.Categories.push(category);

    return category;
  }

  async getById(categoryId: number): Promise<TransactionCategory | null> {
    const category = this.Categories.find((c) => c.id === categoryId);

    if (!category) return null;

    return category;
  }

  async fetchByUserId(userId: string): Promise<TransactionCategory[]> {
    const categories = this.Categories.filter((c) => c.userId === userId);

    return categories;
  }

  async update(
    data: TransactionCategoryUpdateParams
  ): Promise<TransactionCategory> {
    const { categoryId, updatedData } = data;

    const categoryIndex = this.Categories.findIndex((c) => c.id === categoryId);

    const updatedCategory = {
      ...this.Categories[categoryIndex],
    };

    updatedCategory.name = updatedData.name ?? updatedCategory.name;

    this.Categories[categoryIndex] = updatedCategory;

    return updatedCategory;
  }

  async delete(categoryId: number): Promise<number> {
    const categoryIndex = this.Categories.findIndex((c) => c.id === categoryId);

    this.Categories.splice(categoryIndex, 0);

    return categoryId;
  }
}
