import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers() {
        return this.userService.findAll();
    }

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        body.email.toLowerCase()
        return this.userService.create(body);
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() body: UpdateUserDto
    ) {
        if(body.email) body.email.toLowerCase()
        return this.userService.update(id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
