import { UsersRepository } from "@/repositories/user-repository";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateUserUseCaseRequest {
  id: string;
  name?: string;
  email?: string;
  password?: string;
}

interface UpdateUserUseCaseResponse {
  user: User;
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    name,
    email,
    password,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    let hashedPassword: string | undefined = undefined;

    if (password) hashedPassword = await hash(password, 6);

    const updatedUser = await this.usersRepository.update(id, {
      name,
      email,
      pwdHash: hashedPassword,
    });

    if (updatedUser === null) throw new ResourceNotFoundError();

    return { user: updatedUser };
  }
}
