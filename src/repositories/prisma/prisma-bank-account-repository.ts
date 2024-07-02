import { BankAccount, Prisma } from "@prisma/client";
import {
  BankAccountRepository,
  BankAccountUpdateParams,
} from "../bank-account-repository";
import { prisma } from "@/lib/prisma";

export class PrismaBankAccountRepository implements BankAccountRepository {
  async create(
    data: Prisma.BankAccountUncheckedCreateInput
  ): Promise<BankAccount> {
    const bankAccount = await prisma.bankAccount.create({
      data,
    });

    return bankAccount;
  }
  async getById(accountId: string): Promise<BankAccount | null> {
    const bankAccount = await prisma.bankAccount.findUnique({
      where: {
        id: accountId,
      },
    });

    return bankAccount;
  }
  async fetchByUserId(userId: string): Promise<BankAccount[]> {
    const bankAccounts = await prisma.bankAccount.findMany({
      where: {
        userId,
      },
    });

    return bankAccounts;
  }
  async update(data: BankAccountUpdateParams): Promise<BankAccount> {
    const { accountId, data: updatedData } = data;
    const updatedBankAccount = await prisma.bankAccount.update({
      data: updatedData,
      where: {
        id: accountId,
      },
    });

    return updatedBankAccount;
  }
  async delete(accountId: string): Promise<string> {
    const deletedBankAccount = await prisma.bankAccount.delete({
      where: { id: accountId },
    });

    return deletedBankAccount.id;
  }
}
