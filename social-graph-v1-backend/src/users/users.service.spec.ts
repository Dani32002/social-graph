import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from './user.entity';
import { TypeORMTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<UserEntity>;
  let userList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [...TypeORMTestingConfig()],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await seedDatabase();
  });

  async function seedDatabase() {
    await userRepository.clear();
    userList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await userRepository.save({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        bio: faker.lorem.sentence(),
        avatarUrl: faker.image.avatar(),
        role: UserRole.USER,
      });
      userList.push(user);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should return all users', async () => {
    const users = await service.findAll();
    expect(users.length).toEqual(userList.length);
  });  

  it('should return a user by id', async () => {
    const storedUser = userList[0];
    const user = await service.findById(storedUser.id);
    expect(user).toBeDefined();
    expect(user.name).toEqual(storedUser.name);
    expect(user.email).toEqual(storedUser.email);
    expect(user.bio).toEqual(storedUser.bio);
    expect(user.avatarUrl).toEqual(storedUser.avatarUrl);
    expect(user.role).toEqual(storedUser.role);
  });

  it('should throw an exception for an invalid user id', async () => {
    await expect(() => service.findById('invalid-id')).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });

  it('should return a user by email', async () => {
    const storedUser = userList[0];
    const user = await service.findOneEmail(storedUser.email);
    expect(user).toBeDefined();
    expect(user.name).toEqual(storedUser.name);
    expect(user.email).toEqual(storedUser.email);
    expect(user.bio).toEqual(storedUser.bio);
    expect(user.avatarUrl).toEqual(storedUser.avatarUrl);
    expect(user.role).toEqual(storedUser.role);
  });

  it('should throw an exception for an invalid user email', async () => {
    await expect(() => service.findOneEmail('invalid-email')).rejects.toHaveProperty('message', 'The user with the given email was not found');
  });

  it('should create a new user', async () => {
    const user: UserEntity = {
      id: '',
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      bio: faker.lorem.sentence(),
      avatarUrl: faker.image.avatar(),
      role: UserRole.USER,
      friends: [],
    };

    await service.create(user);
    const storedUser = await userRepository.findOne({ where: { email: user.email } });
    expect(storedUser).toBeDefined();
    const s = storedUser!;
    expect(s.name).toEqual(user.name);
    expect(s.email).toEqual(user.email);
    expect(s.bio).toEqual(user.bio);
    expect(s.avatarUrl).toEqual(user.avatarUrl);
    expect(s.role).toEqual(user.role);
  });

  it('create should fail with duplicate email', async () => {
    const user: UserEntity = {
      id: '',
      name: faker.name.fullName(),
      email: userList[0].email,
      password: faker.internet.password(),
      bio: faker.lorem.sentence(),
      avatarUrl: faker.image.avatar(),
      role: UserRole.USER,
      friends: [],
    };

    await expect(() => service.create(user)).rejects.toHaveProperty('message', 'User email must be unique');
  });

  it('create should fail with invalid name', async () => {
    const user: UserEntity = {
      id: '',
      name: '',
      email: faker.internet.email(),
      password: faker.internet.password(),
      bio: faker.lorem.sentence(),
      avatarUrl: faker.image.avatar(),
      role: UserRole.USER,
      friends: [],
    };

    await expect(() => service.create(user)).rejects.toHaveProperty('message', "User name must not be empty");
  });

  it('create should fail with invalid email', async () => {
    const user: UserEntity = {
      id: '',
      name: faker.name.fullName(),
      email: '',
      password: faker.internet.password(),
      bio: faker.lorem.sentence(),
      avatarUrl: faker.image.avatar(),
      role: UserRole.USER,
      friends: [],
    };

    await expect(() => service.create(user)).rejects.toHaveProperty('message', "User email must not be empty");
  });

  it('create should fail with invalid password', async () => {
    const user: UserEntity = {
      id: '',
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: '',
      bio: faker.lorem.sentence(),
      avatarUrl: faker.image.avatar(),
      role: UserRole.USER,
      friends: [],
    };

    await expect(() => service.create(user)).rejects.toHaveProperty('message', "User password must be at least 6 characters long");
  });

  it('create should fail with a short password', async () => {
    const user: UserEntity = {
      id: '',
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: 'short',
      bio: faker.lorem.sentence(),
      avatarUrl: faker.image.avatar(),
      role: UserRole.USER,
      friends: [],
    };

    await expect(() => service.create(user)).rejects.toHaveProperty('message', "User password must be at least 6 characters long");
  });

  it('create should fail with an invalid role', async () => {
    const user: UserEntity = {
      id: '',
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      bio: faker.lorem.sentence(),
      avatarUrl: faker.image.avatar(),
      role: 'invalid-role' as UserRole,
      friends: [],
    };

    await expect(() => service.create(user)).rejects.toHaveProperty('message', "User role must be either 'user' or 'admin'");
  });

  it('update should modify a user', async () => {
    const user: UserEntity = userList[0];
    user.name = faker.name.fullName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.bio = faker.lorem.sentence();
    user.avatarUrl = faker.image.avatar();
    user.role = UserRole.USER;
    user.friends = [];

    await service.update(user.id, user);
    const updatedUser = await userRepository.findOne({ where: { id: user.id } });
    expect(updatedUser).toBeDefined();
    expect(updatedUser!.name).toEqual(user.name);
    expect(updatedUser!.email).toEqual(user.email);
    expect(updatedUser!.bio).toEqual(user.bio);
    expect(updatedUser!.avatarUrl).toEqual(user.avatarUrl);
    expect(updatedUser!.role).toEqual(user.role);
  });

  it('update should fail for an invalid user id', async () => {
    let user: UserEntity = userList[0];
    user = { ...user, name: faker.name.fullName() };

    await expect(() => service.update('invalid-id', user)).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });

  it('update should fail with duplicate email', async () => {
    let user: UserEntity = userList[0];
    user = { ...user, email: userList[1].email };
    await expect(() => service.update(user.id, user)).rejects.toHaveProperty('message', 'User email must be unique');
  });

  it('delete should remove a user', async () => {
    const user: UserEntity = userList[0];
    await service.delete(user.id);
    const deletedUser = await userRepository.findOne({ where: { id: user.id } });
    expect(deletedUser).toBeNull();
  });

  it('delete should fail for an invalid user id', async () => {
    await expect(() => service.delete('invalid-id')).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });

  it('addFriend should add a friend to a user', async () => {
    const user: UserEntity = userList[0];
    const friend: UserEntity = userList[1];
    await service.addFriend(user.id, friend.id);
    const updatedUser = await userRepository.findOne({ where: { id: user.id }, relations: ['friends'] });
    expect(updatedUser).toBeDefined();
    expect(updatedUser!.friends.length).toBe(1);
    expect(updatedUser!.friends[0].id).toBe(friend.id);
  });

  it('addFriend should fail for an invalid user id', async () => {
    const friend: UserEntity = userList[0];
    await expect(() => service.addFriend('invalid-id', friend.id)).rejects.toHaveProperty('message', "User or friend not found");
  });

  it('addFriend should fail for an invalid friend id', async () => {
    const user: UserEntity = userList[0];
    await expect(() => service.addFriend(user.id, 'invalid-id')).rejects.toHaveProperty('message', "User or friend not found");
  });

  it('addFriend should fail if they are already friends', async () => {
    const user: UserEntity = userList[0];
    const friend: UserEntity = userList[1];
    await service.addFriend(user.id, friend.id);
    await expect(() => service.addFriend(user.id, friend.id)).rejects.toHaveProperty('message', 'The users are already friends');
  });

  it('addFriend should fail if user tries to add themselves', async () => {
    const user: UserEntity = userList[0];
    await expect(() => service.addFriend(user.id, user.id)).rejects.toHaveProperty('message', 'Users cannot be friends with themselves');
  });

  it('removeFriend should remove a friend from a user', async () => {
    const user: UserEntity = userList[0];
    const friend: UserEntity = userList[1];
    await service.addFriend(user.id, friend.id);
    await service.removeFriend(user.id, friend.id);
    const updatedUser = await userRepository.findOne({ where: { id: user.id }, relations: ['friends'] });
    expect(updatedUser).toBeDefined();
    expect(updatedUser!.friends.length).toBe(0);
  });

  it('removeFriend should fail for an invalid user id', async () => {
    const friend: UserEntity = userList[0];
    await expect(() => service.removeFriend('invalid-id', friend.id)).rejects.toHaveProperty('message', "User or friend not found");
  });

  it('removeFriend should fail for an invalid friend id', async () => {
    const user: UserEntity = userList[0];
    await expect(() => service.removeFriend(user.id, 'invalid-id')).rejects.toHaveProperty('message', "User or friend not found");
  });

  it('removeFriend should fail if they are not friends', async () => {
    const user: UserEntity = userList[0];
    const friend: UserEntity = userList[1];
    await expect(() => service.removeFriend(user.id, friend.id)).rejects.toHaveProperty('message', "The specified friend is not in the user's friend list");
  });

  it('getFriends should return a user\'s friends', async () => {
    const user: UserEntity = userList[0];
    await service.addFriend(user.id, userList[1].id);
    await service.addFriend(user.id, userList[2].id);
    const friends = await service.getFriends(user.id);
    expect(friends).toHaveLength(2);
    expect(friends.map(f => f.id)).toEqual(expect.arrayContaining([userList[1].id, userList[2].id]));
  });

  it('getFriends should fail for an invalid user id', async () => {
    await expect(() => service.getFriends('invalid-id')).rejects.toHaveProperty('message', "User not found");
  });

});
