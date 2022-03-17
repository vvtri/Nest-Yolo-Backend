import { Min } from 'class-validator'
import { User } from 'src/auth/entities/user.entity'
import { Product } from 'src/products/products.entity'
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm'

@Entity()
@Unique(['userId', 'productId'])
export class Cart {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	@Min(0)
	quantity: number

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date

	@ManyToOne(() => User, (user) => user.carts, { onDelete: 'SET NULL' })
	user: User

	@Column()
	userId: number

	@ManyToOne(() => Product, (product) => product.carts, {
		onDelete: 'SET NULL',
	})
	product: Product

	@Column()
	productId: number
}
