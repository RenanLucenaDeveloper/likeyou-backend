import { IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    name: string

    @IsOptional()
    cpf: string

    @IsOptional()
    email: string

    @IsOptional()
    phone: string
}