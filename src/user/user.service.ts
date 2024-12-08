import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        // Verifica email
        const checkEmail = await this.userRepository.findOneBy({ email: userDto.email })
        if(checkEmail) throw new BadRequestException('Este email já está em uso!');
        
        // Verifica CPF
        const checkCpf = await this.userRepository.findOneBy({ cpf: userDto.cpf })
        if(checkCpf) throw new BadRequestException('Este CPF já está em uso!');
        
        // Verifica Celular
        const checkPhone = await this.userRepository.findOneBy({ phone: userDto.phone })
        if(checkPhone) throw new BadRequestException('Este telefone já está em uso!');


        // crypt da senha
        const salt = await bcrypt.genSalt();
        userDto.password = await bcrypt.hash(userDto.password, salt);
        
        // create user
        const user = this.userRepository.create(userDto)

        try {
            return this.userRepository.save(user)
        } catch (error) {
            if (error.code === '23505') { // PostgreSQL: Violação de chave única
                if (error.detail.includes('email')) {
                    throw new NotFoundException('Este email já está em uso!');
                }
                if (error.detail.includes('cpf')) {
                    throw new NotFoundException('Este CPF já está em uso!');
                }
                if (error.detail.includes('phone')) {
                    throw new NotFoundException('Este telefone já está em uso!');
                }
            }
            throw error;
        }
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
