import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    @ApiSecurity("JWT-auth")
    @UseGuards(JwtAuthGuard)
    async getAllUsers() {
        return this.userService.findAll();
    }

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        body.email = body.email.toLowerCase()
        return this.userService.create(body);
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    @ApiSecurity("JWT-auth")
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @Param('id') id: string,
        @Body() body: UpdateUserDto
    ) {
        if(body.email) body.email = body.email.toLowerCase()
        return this.userService.update(id, body);
    }

    @Delete(':id')
    @ApiSecurity("JWT-auth")
    @UseGuards(JwtAuthGuard)
    async deleteUserById(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
