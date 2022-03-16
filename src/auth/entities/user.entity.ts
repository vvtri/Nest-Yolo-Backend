import { IsEmail, IsPhoneNumber } from 'class-validator'
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { UserResetPassword } from './userResetpassword.entity'
import { UserRole } from './userRole.entity'
import { UserVefification } from './userVerification.entity'

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	@IsEmail()
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
	@IsPhoneNumber()
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

	@Column({ nullable: true })
	refreshToken: string

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
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

	@OneToMany(() => UserRole, (roles) => roles.user)
	userRoles: UserRole[]
}
