import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BusinessExceptionsFilter } from './shared/filters/business-exceptions.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

// App module integrating TypeORM with Postgres and Users module
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'social-graph',
      entities: [UserEntity],
      synchronize: true,
    }),
    AuthModule,
  ],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: BusinessExceptionsFilter },
  ],
})
export class AppModule {}
