import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { MongoId } from './dtos/mongo-id.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {
    const configService = new ConfigService(); // Assuming ConfigService is imported and injected
    console.log(configService.get('MONGO_URI'));
  }

  async findUsers(): Promise<User[]> {
    return await this.UserModel.find({});
  }

  async findUserById(id: MongoId): Promise<UserResponseDto> {
    const user = await this.UserModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Not found user ${id}`);
    }
    return new UserResponseDto(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await new this.UserModel(createUserDto);
    await createdUser.save();

    return createdUser;
  }

  async updateUser(id: MongoId, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.UserModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    }).exec();
    if (!user) {
      throw new NotFoundException(`Not found user ${id}`);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.UserModel.findByIdAndDelete(id).exec();
  }
}
