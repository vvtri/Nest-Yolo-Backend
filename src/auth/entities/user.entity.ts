import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { UserResetPassword } from './userResetpassword.entity'
import { UserVefification } from './userVerification.entity'

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	email: string

	@Column()
	password: string

	@Column({
		nullable: true,
	})
	avatar: string

	@Column({
		nullable: true,
	})
	phone: string

	@Column({
		nullable: true,
	})
	address: string

	@Column({
		nullable: true,
		default: false,
	})
	verified: boolean

	@Column({
		nullable: true,
	})
	name: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@OneToOne(
		() => UserVefification,
		(userVerification) => userVerification.user
	)
	userVerification: UserVefification

	@OneToOne(
		() => UserVefification,
		(userResetPassword) => userResetPassword.user
	)
	userResetPassword: UserResetPassword
}
