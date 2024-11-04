import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Not found user ${id}`);
    }
    return new UserResponseDto(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const newUser: User = await this.userRepository.save(createUserDto);
    return new UserResponseDto(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // 1) find user to update
    const userToUpdate = await this.findUserById(id);
    // 2) update the element
    const updatedUser = {
      ...userToUpdate,
      ...updateUserDto,
    };
    // 3) save updated user
    return await this.userRepository.save(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
