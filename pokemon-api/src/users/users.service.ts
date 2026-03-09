import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  // async create(data: {
  //   name: string;
  //   email: string;
  //   passwordHash: string;
  // }): Promise<User> {
  //   const user = this.usersRepository.create(data);
  //   return this.usersRepository.save(user);
  // }
  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    avatarUrl?: string;
  }): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }
  // async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
  //   const user = await this.usersRepository.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException('Usuário não encontrado');
  //   }

  //   Object.assign(user, updateUserDto);
  //   return this.usersRepository.save(user);
  // }
  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se o utilizador enviou uma nova senha, encriptamos e guardamos no passwordHash
    if (updateUserDto.password) {
      user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      // Apagamos a propriedade password do DTO para não causar conflitos no Object.assign
      delete updateUserDto.password; 
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }
}

