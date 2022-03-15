import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class UserResetPassword {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	email: string

	@Column()
	secretString: string

	@CreateDateColumn()
	createdAt: Date

	@Column()
	expiredAt: Date

	@OneToOne(() => User, (user) => user.userResetPassword, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	user: User

	@Column()
	userId: number
}
