import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    findAll() {
        return this.userRepository.find();
    }

    create(userDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(userDto)

        return this.userRepository.save(user)
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id })

        if(!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return user
    }

    async update(id: string, userDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOneBy({ id })

        if(!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        Object.assign(user, userDto)
        return this.userRepository.save(user)
    }

    async remove(id: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ id })

        if(!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        await this.userRepository.delete(user)
    }
}
