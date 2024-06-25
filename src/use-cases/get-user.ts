import { UsersRepository } from "@/repositories/user-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserUseCaseRequest {
  userId: string;
}

interface GetUserUseCaseResponse {
  user: User;
}

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (user === null) throw new ResourceNotFoundError();

    return { user };
  }
}
