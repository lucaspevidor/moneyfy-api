import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryBankAccountRepository } from "@/repositories/in-memory/in-memory-bank-account-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UpdateBankAccountUseCase } from "./update-bank-account";
import { NotAuthorizedError } from "./errors/not-authorized-error";

let usersRepository: InMemoryUsersRepository;
let bankAccountRepository: InMemoryBankAccountRepository;
let sut: UpdateBankAccountUseCase;

describe("Update bank account use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bankAccountRepository = new InMemoryBankAccountRepository();
    sut = new UpdateBankAccountUseCase(bankAccountRepository);
  });

  it("Should be able to update a bank account", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    const bankAccount = await bankAccountRepository.create({
      balance: 0,
      currency: "BRL",
      name: "Account 1",
      userId,
    });

    const { updatedBankAccount } = await sut.execute({
      bankAccountId: bankAccount.id,
      userId,
      updatedData: {
        balance: 10000,
        currency: "USD",
        name: "Account 2",
      },
    });

    const returnedBankAccount = await bankAccountRepository.getById(
      bankAccount.id
    );

    expect(updatedBankAccount).toEqual(returnedBankAccount);
    expect(updatedBankAccount).toEqual(
      expect.objectContaining({
        id: bankAccount.id,
        balance: 10000,
        currency: "USD",
        name: "Account 2",
        userId,
      })
    );
  });

  it("Should throw when updating another user bank account", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    const bankAccount = await bankAccountRepository.create({
      balance: 0,
      currency: "BRL",
      name: "Account 1",
      userId,
    });

    await expect(() =>
      sut.execute({
        bankAccountId: bankAccount.id,
        userId: "Another user ID",
        updatedData: {
          balance: 10000,
          currency: "USD",
          name: "Account 2",
        },
      })
    ).rejects.toBeInstanceOf(NotAuthorizedError);
  });

  it("Should throw when updating non-existent bank account", async () => {
    await expect(() =>
      sut.execute({
        bankAccountId: "Non existent ID",
        userId: "Another user ID",
        updatedData: {
          balance: 10000,
          currency: "USD",
          name: "Account 2",
        },
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
