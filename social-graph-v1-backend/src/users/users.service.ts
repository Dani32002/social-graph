import { Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessErrorType, BusinessLogicException } from '../shared/errors/business-errors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async findAll(): Promise<UserEntity[]> {
        const users: UserEntity[] = await this.userRepository.find({
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                avatarUrl: true,
                role: true
            }
        });
        return users;
    }

    async findById(id: string): Promise<UserEntity> {
        const user: UserEntity | null = await this.userRepository.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                avatarUrl: true,
                role: true
            }
        });
        if (!user) {
            throw new BusinessLogicException("The user with the given id was not found", BusinessErrorType.NOT_FOUND);
        }
        return user;
    }

    async findOneEmail(email: string): Promise<UserEntity> {
        const user: UserEntity | null = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new BusinessLogicException("The user with the given email was not found", BusinessErrorType.NOT_FOUND);
        }
        return user;
    }

    async create(user: UserEntity): Promise<UserEntity> {
        await this.validate(user, this.userRepository);
        user.password = await this.hashPassword(user.password);
        return await this.userRepository.save(user);
    }


    async update(id: string, user: UserEntity): Promise<UserEntity> {
        const existingUser: UserEntity = await this.findById(id);

        if (!existingUser) {
            throw new BusinessLogicException("The user with the given id was not found", BusinessErrorType.NOT_FOUND);
        }

        await this.validate(user, this.userRepository, true, id);

        existingUser.name = user.name;
        existingUser.email = user.email;
        if (user.password !== existingUser.password) {
            existingUser.password = await this.hashPassword(user.password);
        }
        existingUser.bio = user.bio;
        existingUser.avatarUrl = user.avatarUrl;
        existingUser.role = user.role;

        return await this.userRepository.save(existingUser);
    }

    async delete(id: string): Promise<void> {
        const user: UserEntity = await this.findById(id);
        if (!user) {
            throw new BusinessLogicException("The user with the given id was not found", BusinessErrorType.NOT_FOUND);
        }

        await this.userRepository.createQueryBuilder()
            .delete()
            .from('user_friends')
            .where('user_id = :id OR friend_id = :id', { id })
            .execute();

        await this.userRepository.remove(user);
    } 

    async addFriend(userId: string, friendId: string): Promise<void> {
        const user: UserEntity | null = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['friends'],
        });
        
        const friend: UserEntity | null = await this.userRepository.findOne({
            where: { id: friendId },
            relations: ['friends'],
        });

        if (!user || !friend) {
            throw new BusinessLogicException("User or friend not found", BusinessErrorType.NOT_FOUND);
        }

        if (user.id === friend.id) {
            throw new BusinessLogicException("Users cannot be friends with themselves", BusinessErrorType.PRECONDITION_FAILED);
        }

        const alreadyFriends = user.friends.some(f => f.id === friendId);
        if (alreadyFriends) {
            throw new BusinessLogicException("The users are already friends", BusinessErrorType.PRECONDITION_FAILED);
        }

        user.friends.push(friend);
        friend.friends.push(user);
        await this.userRepository.save(friend);
        await this.userRepository.save(user);
    }

    async removeFriend(userId: string, friendId: string): Promise<void> {
        const user: UserEntity | null = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['friends'],
        });

        const friend: UserEntity | null = await this.userRepository.findOne({
            where: { id: friendId },
            relations: ['friends'],
        });

        if (!user || !friend) {
            throw new BusinessLogicException("User or friend not found", BusinessErrorType.NOT_FOUND);
        }

        const friendIndex = user.friends.findIndex(f => f.id === friendId);
        const reverseFriendIndex = friend.friends.findIndex(f => f.id === userId);

        if (friendIndex === -1 || reverseFriendIndex === -1) {
            throw new BusinessLogicException("The specified friend is not in the user's friend list", BusinessErrorType.PRECONDITION_FAILED);
        }

        friend.friends = friend.friends.filter(f => f.id !== userId);
        await this.userRepository.save(friend);
        user.friends = user.friends.filter(f => f.id !== friendId);
        await this.userRepository.save(user);

    }

    async getFriends(userId: string): Promise<UserEntity[]> {
        const user: UserEntity | null = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['friends'],
        });

        if (!user) {
            throw new BusinessLogicException("User not found", BusinessErrorType.NOT_FOUND);
        }
        return user.friends;
    }

    async validate(user: UserEntity, userRepository: Repository<UserEntity>, update: boolean = false, id: string | null = null): Promise<void> {
        if (!user.name || user.name.trim().length === 0) {
            throw new BusinessLogicException("User name must not be empty", BusinessErrorType.BAD_REQUEST);
        }

        if (!user.email || user.email.trim().length === 0) {
            throw new BusinessLogicException("User email must not be empty", BusinessErrorType.BAD_REQUEST);
        }

        const othersWithSameEmail: UserEntity[] = await userRepository.find({ where: { email: user.email } });
        
        if (othersWithSameEmail.length > 0 && !update) {
            throw new BusinessLogicException("User email must be unique", BusinessErrorType.BAD_REQUEST);
        } else if (othersWithSameEmail.length === 1 && update && othersWithSameEmail[0].id !== id) {
            throw new BusinessLogicException("User email must be unique", BusinessErrorType.BAD_REQUEST);
        }

        if (!user.password || user.password.trim().length < 6) {
            throw new BusinessLogicException("User password must be at least 6 characters long", BusinessErrorType.BAD_REQUEST);
        }

        if (!Object.values(UserRole).includes(user.role)) {
            throw new BusinessLogicException("User role must be either 'user' or 'admin'", BusinessErrorType.BAD_REQUEST);
        }

    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

}
