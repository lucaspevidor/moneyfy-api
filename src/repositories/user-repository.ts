import { Prisma, User } from "@prisma/client";

export interface UpdateUserParams {
  email?: string;
  pwdHash?: string;
  name?: string;
}

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(userId: string, updatedData: UpdateUserParams): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  delete(userId: string): Promise<string>;
}
