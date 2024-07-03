import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { UpdateUserUseCase } from "../update-user";

export function MakeUpdateUserUseCase(): UpdateUserUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();

  return new UpdateUserUseCase(usersRepository);
}
