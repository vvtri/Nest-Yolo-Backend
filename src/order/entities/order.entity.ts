import { User } from 'src/auth/entities/user.entity'
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { OrderDetail } from './orderDetail.entity'

@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date

	@ManyToOne(() => User, (user) => user.orders, { onDelete: 'SET NULL' })
	user: User

	@Column()
	userId: number

	@OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
	orderDetails: OrderDetail[]
}
