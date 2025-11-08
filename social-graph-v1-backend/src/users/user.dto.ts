import { IsEmail, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    bio: string;

    @ApiProperty()
    @IsString()
    @IsUrl()
    avatarUrl: string;

    @ApiProperty()
    @IsString()
    role: string;

    @ApiProperty()
    @IsString()
    password?: string;
}