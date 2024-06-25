import { BankAccount, Prisma } from "@prisma/client";

export interface BankAccountUpdateParams {
  accountId: string;
  data: Partial<
    Pick<
      Prisma.BankAccountUncheckedCreateInput,
      "balance" | "currency" | "name"
    >
  >;
}

export interface BankAccountRepository {
  create(data: Prisma.BankAccountUncheckedCreateInput): Promise<BankAccount>;
  getById(accountId: string): Promise<BankAccount | null>;
  fetchByUserId(userId: string): Promise<BankAccount[] | null>;
  update(data: BankAccountUpdateParams): Promise<BankAccount>;
  delete(accountId: string): Promise<string>;
}
