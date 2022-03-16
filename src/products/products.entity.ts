import { Min } from 'class-validator'
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	name: string

	@Column({ type: 'text' })
	description: string

	@Column({ default: true })
	available: boolean

	@Column()
	unit: string

	@Column({ type: 'numeric' })
	@Min(0)
	price: number

	@Column()
	@Min(0)
	amount: number

	@Column()
	gender: boolean

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date
}
