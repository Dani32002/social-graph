import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('users')
export class UserEntity {
    
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public name: string;
    
    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    @Column()
    public bio: string;

    @Column()
    public avatarUrl: string;

    @Column({
      type: 'simple-enum', 
      enum: UserRole,
      default: UserRole.USER,
    })
    public role: UserRole;

    @ManyToMany(() => UserEntity, user => user.friends)
    @JoinTable({
      name: 'user_friends',
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'friend_id', referencedColumnName: 'id' },
    })
    public friends: UserEntity[];

}
