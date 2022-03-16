import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

export enum UserRoleEnum {
	ADMIN = 'ADMIN',
	CLIENT = 'CLIENT',
}

@Entity()
export class UserRole {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.CLIENT })
	role: UserRoleEnum

	@ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
	user: User

	@Column()
	userId: number
}
