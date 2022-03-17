import { Product } from 'src/products/products.entity'
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Order } from './order.entity'

@Entity()
export class OrderDetail {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	quantity: number

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@ManyToOne(() => Order, (order) => order.orderDetails, {
		onDelete: 'CASCADE',
	})
	order: Order

	@Column()
	orderId: number

	@ManyToOne(() => Product, (product) => product.orderDetails, {
		onDelete: 'SET NULL',
	})
	product: Product

	@Column()
	productId: number
}
