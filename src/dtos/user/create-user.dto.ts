import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsNotEmpty()
    cpf: string

    @ApiProperty()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    phone: string

    @ApiProperty()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    @IsOptional()
    profileImage
}