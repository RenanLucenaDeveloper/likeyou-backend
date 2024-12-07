import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    cpf: string

    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    phone: string

    @IsNotEmpty()
    password: string
}