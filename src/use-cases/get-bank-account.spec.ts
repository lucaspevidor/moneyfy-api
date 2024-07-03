import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { InMemoryBankAccountRepository } from "@/repositories/in-memory/in-memory-bank-account-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetBankAccountUseCase } from "./get-bank-account";

let usersRepository: UsersRepository;
let bankAccountRepository: BankAccountRepository;
let sut: GetBankAccountUseCase;

describe("Get bank account use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bankAccountRepository = new InMemoryBankAccountRepository();
    sut = new GetBankAccountUseCase(usersRepository, bankAccountRepository);
  });

  it("Should be able to get a bank account from a valid user", async () => {
    const userId = "Some user id";

    const bankAccountData = {
      balance: 1000,
      currency: "BRL",
      name: "Bank account 1",
      userId,
    };

    const bankAccount = await bankAccountRepository.create(bankAccountData);

    const { bankAccount: retrievedBankAccount } = await sut.execute({
      bankAccountId: bankAccount.id,
      userId,
    });

    expect(retrievedBankAccount).toEqual({
      id: bankAccount.id,
      ...bankAccountData,
    });
  });

  it("Should throw when getting an invalid bank account", async () => {
    await expect(() =>
      sut.execute({
        bankAccountId: "Invalid id",
        userId: "any user id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when getting a bank account from another user", async () => {
    const userId = "Some user id";

    const bankAccountData = {
      balance: 1000,
      currency: "BRL",
      name: "Bank account 1",
      userId,
    };

    const bankAccount = await bankAccountRepository.create(bankAccountData);

    await expect(() =>
      sut.execute({
        bankAccountId: bankAccount.id,
        userId: "Another user Id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
