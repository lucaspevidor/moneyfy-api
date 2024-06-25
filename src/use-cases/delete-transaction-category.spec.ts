import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAuthorizedError } from "./errors/not-authorized-error";
import { InMemoryTransactionCategoryRepository } from "@/repositories/in-memory/in-memory-transaction-category-repository";
import { DeleteTransactionCategoryUseCase } from "./delete-transaction-category";

let usersRepository: InMemoryUsersRepository;
let transactionCategoryRepository: InMemoryTransactionCategoryRepository;
let sut: DeleteTransactionCategoryUseCase;

describe("Delete transaction category use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    transactionCategoryRepository = new InMemoryTransactionCategoryRepository();
    sut = new DeleteTransactionCategoryUseCase(transactionCategoryRepository);
  });

  it("Should be able to delete a transaction category", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    const transactionCategory = await transactionCategoryRepository.create({
      name: "Casa",
      userId,
    });

    const { deletedTransactionCategoryId } = await sut.execute({
      userId,
      transactionCategoryId: transactionCategory.id,
    });

    expect(deletedTransactionCategoryId).toEqual(transactionCategory.id);
  });

  it("Should throw when deleting non-existent transaction category", async () => {
    await expect(() =>
      sut.execute({
        transactionCategoryId: 1,
        userId: "non-existent",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when deleting a transaction category of another user", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    const transactionCategory = await transactionCategoryRepository.create({
      name: "Casa",
      userId,
    });

    await expect(() =>
      sut.execute({
        transactionCategoryId: transactionCategory.id,
        userId: "another-user-id",
      })
    ).rejects.toBeInstanceOf(NotAuthorizedError);
  });
});
