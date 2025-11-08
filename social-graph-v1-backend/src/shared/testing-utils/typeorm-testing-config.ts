import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../users/user.entity";
import { AuthModule } from "../../auth/auth.module";
import { UsersModule } from "../../users/users.module";


export const TypeORMTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [UserEntity],
        synchronize: true,
    }),
    TypeOrmModule.forFeature([UserEntity]),
]