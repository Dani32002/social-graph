/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector, private userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<UserRole[]>("roles", [
      context.getHandler(),
      context.getClass()
    ]);
    if (!requireRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;

    const retrieved = await this.userService.findOneEmail(user.email);

    if (!retrieved) {
      return false;
    }

    return requireRoles.some((role) => retrieved.role.includes(role));;
  }
}
