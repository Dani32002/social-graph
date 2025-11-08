import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConstants from '../shared/security/constants';

@Module({
  providers: [UsersService, AuthService],
  imports: [
    TypeOrmModule.forFeature([UserEntity]), 
    AuthModule,
    JwtModule.register(
      {
        secret: jwtConstants.JWT_SECRET,
        signOptions: { expiresIn: parseInt(jwtConstants.JWT_EXPIRATION, 10) }
      }
    )
  ],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
