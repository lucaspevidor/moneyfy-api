import { UsersRepository } from "@/repositories/user-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteUserUseCaseRequest {
  userId: string;
}

interface DeleteUserUseCaseResponse {
  userId: string;
}

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const foundUser = await this.usersRepository.findById(userId);
    if (foundUser === null) throw new ResourceNotFoundError();

    this.usersRepository.delete(foundUser.id);

    return { userId: foundUser.id };
  }
}
