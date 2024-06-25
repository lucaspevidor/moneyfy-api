import { Prisma, User } from "@prisma/client";
import {
  UpdateUserParams,
  UsersRepository,
} from "@/repositories/user-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public Users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      email: data.email,
      pwdHash: data.pwdHash,
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.Users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = this.Users.find((u) => u.email === email);

    return foundUser || null;
  }

  async findById(userId: string): Promise<User | null> {
    const foundUser = this.Users.find((u) => u.id === userId);

    return foundUser || null;
  }

  async update(
    userId: string,
    updatedData: UpdateUserParams
  ): Promise<User | null> {
    const foundUser = this.Users.findIndex((u) => u.id === userId);

    if (foundUser === -1) return null;

    const updatedUser = {
      ...this.Users[foundUser],
      updatedAt: new Date(),
    };

    updatedUser.email = updatedData.email ?? updatedUser.email;
    updatedUser.pwdHash = updatedData.pwdHash ?? updatedUser.pwdHash;
    updatedUser.name = updatedData.name ?? updatedUser.name;

    this.Users[foundUser] = updatedUser;

    return updatedUser;
  }

  async delete(userId: string): Promise<string> {
    const foundUserIndex = this.Users.findIndex((u) => (u.id = userId));
    const id = this.Users[foundUserIndex].id;

    this.Users.splice(foundUserIndex, 1);

    return id;
  }
}
