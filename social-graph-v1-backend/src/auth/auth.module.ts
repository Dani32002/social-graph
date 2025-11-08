import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RolesGuard } from './guards/roles.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import jwtConstants from '../shared/security/constants';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';

@Module({
  providers: [AuthService, UsersService, JwtService, LocalStrategy, JwtStrategy, RolesGuard],
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]), 
    JwtModule.register({
      secret: jwtConstants.JWT_SECRET,
      signOptions: { expiresIn: parseInt(jwtConstants.JWT_EXPIRATION, 10) },
    }),
    forwardRef(() => UsersModule),
  ],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
