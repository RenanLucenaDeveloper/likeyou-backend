import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getAllUsers() {
        return this.userService.findAll();
    }

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        return this.userService.create(body);
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() body: UpdateUserDto
    ) {
        return this.userService.update(id, body);
    }

    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
