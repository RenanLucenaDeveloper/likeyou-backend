import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
      ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email.toLowerCase());
        if (user && (await bcrypt.compare(password, user.password))) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { 
            username: user.name, 
            profileImage: user.profileImage,
            sub: user.id 
        };
        
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}