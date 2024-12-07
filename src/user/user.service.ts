import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    findAll() {
        return this.userRepository.find();
    }

    async create(userDto: CreateUserDto): Promise<User> {
        // crypt da senha
        const salt = await bcrypt.genSalt();
        userDto.password = await bcrypt.hash(userDto.password, salt);
        
        // create user
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

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email })

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
