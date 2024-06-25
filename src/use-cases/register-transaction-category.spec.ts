import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryTransactionCategoryRepository } from "@/repositories/in-memory/in-memory-transaction-category-repository";
import { RegisterTransactionCategoryUseCase } from "./register-transaction-category";

let usersRepository: InMemoryUsersRepository;
let transactionCategoryRepository: InMemoryTransactionCategoryRepository;
let sut: RegisterTransactionCategoryUseCase;

describe("Register transaction category use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    transactionCategoryRepository = new InMemoryTransactionCategoryRepository();
    sut = new RegisterTransactionCategoryUseCase(
      transactionCategoryRepository,
      usersRepository
    );
  });

  it("Should be able to register a new transaction category", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    const { transactionCategory: registeredTransactionCategory } =
      await sut.execute({
        name: "Casa",
        userId,
      });

    expect(registeredTransactionCategory).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: "Casa",
        userId,
      })
    );
  });

  it("Should throw when creating transaction cateogory with invalid user", async () => {
    await expect(() =>
      sut.execute({
        name: "Casa",
        userId: "invalid id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
