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
export class UserVefification {
	@PrimaryGeneratedColumn()
	id: number

	@OneToOne(() => User)
	@JoinColumn()
	user: User

	@Column()
	userId: number

	@Column()
	secretString: string

	@CreateDateColumn()
	createdAt: Date

	@Column()
	expiredAt: Date
}
