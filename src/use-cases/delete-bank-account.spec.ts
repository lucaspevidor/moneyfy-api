import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryBankAccountRepository } from "@/repositories/in-memory/in-memory-bank-account-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { DeleteBankAccountUseCase } from "./delete-bank-account";
import { NotAuthorizedError } from "./errors/not-authorized-error";

let usersRepository: InMemoryUsersRepository;
let bankAccountRepository: InMemoryBankAccountRepository;
let sut: DeleteBankAccountUseCase;

describe("Delete bank account use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bankAccountRepository = new InMemoryBankAccountRepository();
    sut = new DeleteBankAccountUseCase(bankAccountRepository);
  });

  it("Should be able to delete a bank account", async () => {
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

    const { deletedBankAccountId } = await sut.execute({
      userId,
      bankAccountId: bankAccount.id,
    });

    expect(deletedBankAccountId).toEqual(bankAccount.id);
  });

  it("Should throw when deleting non-existent bank account", async () => {
    await expect(() =>
      sut.execute({
        bankAccountId: "non-existent",
        userId: "non-existent",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when deleting a bank account of another user", async () => {
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
        userId: "another-user-id",
      })
    ).rejects.toBeInstanceOf(NotAuthorizedError);
  });
});
