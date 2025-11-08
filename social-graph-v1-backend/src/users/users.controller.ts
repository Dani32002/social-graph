import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards, ForbiddenException, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { UserEntity, UserRole } from './user.entity';
import { UserDto } from './user.dto';
import { plainToInstance } from 'class-transformer';
import { Roles } from '../shared/security/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: any) {
        console.log('UsersController: Login request received');
        return this.authService.login(req);
    }

    @Get()
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async findAll(): Promise<UserEntity[]> {
        console.log('UsersController: Fetching all users');
        return await this.usersService.findAll();
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async findOne(@Param('id') id: number): Promise<UserEntity> {
        console.log(`UsersController: Fetching user with ID ${id}`);
        return await this.usersService.findById(id.toString());
    }

    @Post('register')
    async register(@Body() userDto: UserDto): Promise<UserEntity> {
        console.log('UsersController: Registering new user');
        const user: UserEntity = plainToInstance(UserEntity, userDto);
        return await this.usersService.create(user);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async update(@Req() req: any, @Param('id') id: string, @Body() userDto: UserDto): Promise<UserEntity> {
        console.log(`UsersController: Updating user with ID ${id}`);
        if (req.user?.role !== UserRole.ADMIN && req.user?.id !== id) {
            throw new ForbiddenException('You can only update your own account');
        }
        const user: UserEntity = plainToInstance(UserEntity, userDto);
        return await this.usersService.update(id, user);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async delete(@Req() req: any, @Param('id') id: string): Promise<void> {
        console.log(`UsersController: Deleting user with ID ${id}`);
        if (req.user?.role !== UserRole.ADMIN && req.user?.id !== id) {
            throw new ForbiddenException('You can only delete your own account');
        }
        return await this.usersService.delete(id);
    }

    @Post(':id/friends/:friendId')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async addFriend(@Req() req: any, @Param('id') id: string, @Param('friendId') friendId: string): Promise<void> {
        console.log(`UsersController: Adding friend with ID ${friendId} to user with ID ${id}`);
        if (req.user?.role !== UserRole.ADMIN && req.user?.id !== id) {
            throw new ForbiddenException('You can only modify friends for your own account');
        }
        return await this.usersService.addFriend(id, friendId);
    }

    @Delete(':id/friends/:friendId')
    @HttpCode(204)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async removeFriend(@Req() req: any, @Param('id') id: string, @Param('friendId') friendId: string): Promise<void> {
        console.log(`UsersController: Removing friend with ID ${friendId} from user with ID ${id}`);
        if (req.user?.role !== UserRole.ADMIN && req.user?.id !== id) {
            throw new ForbiddenException('You can only modify friends for your own account');
        }
        return await this.usersService.removeFriend(id, friendId);
    }

    @Get(':id/friends')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async findFriends(@Param('id') id: string): Promise<UserEntity[]> {
        console.log(`UsersController: Fetching friends for user with ID ${id}`);
        return await this.usersService.getFriends(id);
    }



}
