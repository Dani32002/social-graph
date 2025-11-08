import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConstants from '../shared/security/constants';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user: UserEntity | undefined = await this.userService.findOneEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async validateEmail(email: string): Promise<any> {
        const user: UserEntity | undefined = await this.userService.findOneEmail(email);
        if (user) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(req: any) {
        const payload = { name: req.user.email, sub: req.user.role };
        return {
            token: this.jwtService.sign(payload, { privateKey: jwtConstants.JWT_SECRET }),
            userId: req.user.id,
        };
    }

}