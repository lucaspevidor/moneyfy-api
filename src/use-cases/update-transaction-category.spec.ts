import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAuthorizedError } from "./errors/not-authorized-error";
import { InMemoryTransactionCategoryRepository } from "@/repositories/in-memory/in-memory-transaction-category-repository";
import { UpdateTransactionCategoryUseCase } from "./update-transaction-category";

let usersRepository: InMemoryUsersRepository;
let transactionCategoryRepository: InMemoryTransactionCategoryRepository;
let sut: UpdateTransactionCategoryUseCase;

describe("Update transaction category use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    transactionCategoryRepository = new InMemoryTransactionCategoryRepository();
    sut = new UpdateTransactionCategoryUseCase(transactionCategoryRepository);
  });

  it("Should be able to update a transaction category", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    const transactionCategory = await transactionCategoryRepository.create({
      name: "Category 1",
      userId,
    });

    const { updatedTransactionCategory } = await sut.execute({
      transactionCategoryId: transactionCategory.id,
      userId,
      updatedData: {
        name: "Category 2",
      },
    });

    const returnedTransactionCategory =
      await transactionCategoryRepository.getById(transactionCategory.id);

    expect(updatedTransactionCategory).toEqual(returnedTransactionCategory);
    expect(updatedTransactionCategory).toEqual(
      expect.objectContaining({
        id: transactionCategory.id,
        name: "Category 2",
        userId,
      })
    );
  });

  it("Should throw when updating another user transaction category", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    const transactionCategory = await transactionCategoryRepository.create({
      name: "Category 1",
      userId,
    });

    await expect(() =>
      sut.execute({
        transactionCategoryId: transactionCategory.id,
        userId: "Another user ID",
        updatedData: {
          name: "Category 2",
        },
      })
    ).rejects.toBeInstanceOf(NotAuthorizedError);
  });

  it("Should throw when updating non-existent transaction category", async () => {
    await expect(() =>
      sut.execute({
        transactionCategoryId: 2,
        userId: "Another user ID",
        updatedData: {
          name: "Category 2",
        },
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
