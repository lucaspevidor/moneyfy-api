import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UpdateUserParams, UsersRepository } from "../user-repository";

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const { email, name, pwdHash } = data;

    const user = await prisma.user.create({
      data: {
        email,
        name,
        pwdHash,
      },
    });

    return user;
  }
  async update(
    userId: string,
    updatedData: UpdateUserParams
  ): Promise<User | null> {
    const updatedUser = await prisma.user.update({
      data: updatedData,
      where: {
        id: userId,
      },
    });

    return updatedUser;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
  async findById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }
  async delete(userId: string): Promise<string> {
    const deleted = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return deleted.id;
  }
}
