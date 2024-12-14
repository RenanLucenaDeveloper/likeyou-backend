import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { ResumedUserType } from 'src/types/resumed-user.type';
import { FeedbackService } from 'src/feedback/feedback.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly FeedbackService: FeedbackService,
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

    async feed(): Promise<ResumedUserType[]> {
        // Pega 6 users
        const users = await this.userRepository
          .createQueryBuilder()
          .orderBy('RANDOM()')
          .limit(6)
          .getMany()

        // callback para pegar os feedbacks
        const addFeedbacks = async ({name, id, description, profileImage}) => {
            const feedbacks = await this.FeedbackService.getFeedbackCounts(id);
            return { name, id, description, profileImage, feedbacks };
        };

        // Retorna os 6 users depois de usar o callback em cada um
        return Promise.all(users.map(addFeedbacks))
    }

    async addGivenFeedbacks(fromUserId: string, users: any[]): Promise<any[]> {
        const userIds = users.map((user) => user.id);
    
        // Consulta os feedbacks dados pelo usuário logado
        const feedbacks = await this.FeedbackService.getGivenFeedbacks(fromUserId, userIds)

        console.log('Feedbacks brutos retornados:', feedbacks);
    
        // Mapeia feedbacks por usuário para anexar ao retorno
        const feedbackMap = feedbacks.reduce((map, feedback) => {
            // Use o console.log para depurar os campos de cada feedback
            console.log('Processando feedback:', feedback);
        
            const toUserId = feedback.touserid; // Certifique-se de usar o nome correto
            if (!toUserId) {
                console.warn('toUserId está vazio ou undefined:', feedback);
                return map; // Ignora entradas inválidas
            }
        
            // Adiciona o feedback no mapa
            map[toUserId] = feedback.feedback;
            return map;
        }, {});

        console.log('Mapa de feedbacks:', feedbackMap);
    
        // Atualiza os usuários com os feedbacks dados
        return users.map((user) => ({
            ...user,
            givenFeedback: feedbackMap[String(user.id)] || null, // Feedback dado ou `null`
        }));
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
