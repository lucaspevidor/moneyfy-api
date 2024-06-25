import { BankAccount, Prisma } from "@prisma/client";
import {
  BankAccountRepository,
  BankAccountUpdateParams,
} from "../bank-account-repository";
import { randomUUID } from "node:crypto";

export class InMemoryBankAccountRepository implements BankAccountRepository {
  BankAccounts: BankAccount[] = [];

  async create(
    data: Prisma.BankAccountUncheckedCreateInput
  ): Promise<BankAccount> {
    const bankAccount: BankAccount = {
      id: randomUUID(),
      balance: data.balance,
      currency: data.currency,
      name: data.name,
      userId: data.userId,
    };

    this.BankAccounts.push(bankAccount);

    return bankAccount;
  }
  async getById(accountId: string): Promise<BankAccount | null> {
    const account = this.BankAccounts.find((a) => a.id === accountId);

    if (!account) return null;

    return account;
  }

  async fetchByUserId(userId: string): Promise<BankAccount[]> {
    const accounts = this.BankAccounts.filter((a) => a.userId === userId);

    return accounts;
  }

  async update(data: BankAccountUpdateParams): Promise<BankAccount> {
    const { accountId, data: updatedData } = data;

    const accountIndex = this.BankAccounts.findIndex((a) => a.id === accountId);

    const updatedAccount = {
      ...this.BankAccounts[accountIndex],
    };

    updatedAccount.balance = updatedData.balance ?? updatedAccount.balance;
    updatedAccount.currency = updatedData.currency ?? updatedAccount.currency;
    updatedAccount.name = updatedData.name ?? updatedAccount.name;

    this.BankAccounts[accountIndex] = updatedAccount;

    return updatedAccount;
  }

  async delete(accountId: string): Promise<string> {
    const accountIndex = this.BankAccounts.findIndex((a) => a.id === accountId);

    this.BankAccounts.splice(accountIndex, 0);

    return accountId;
  }
}
