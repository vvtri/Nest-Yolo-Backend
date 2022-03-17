import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { changeQuantityQuery } from 'src/order/query'
import { Product } from 'src/products/products.entity'
import { Cart } from './cart.entity'
import { CartRepository } from './cart.repository'
import { AddCartDto, ChangeQuantityDto } from './dtos'

@Injectable()
export class CartService {
	constructor(
		@InjectRepository(CartRepository) private cartRepo: CartRepository
	) {}

	getCart(id: number): Promise<Cart[]> {
		return this.cartRepo.getCart(id)
	}

	async addCart(userId: number, addCartDto: AddCartDto): Promise<void> {
		const { productId, quantity } = addCartDto

		try {
			await this.cartRepo.manager.transaction(async (manager) => {
				const found = await this.cartRepo.findOne({ userId, productId })

				// Product exist in cart
				if (found) {
					const result = await manager.query(changeQuantityQuery, [
						quantity,
						userId,
						productId,
					])

					const affected = result[1]

					if (affected === 0)
						throw new BadRequestException('Invalid quantity')
					return
				}

				const product = await manager.findOne(Product, productId, {
					lock: { mode: 'pessimistic_write' },
				})

				if (product.amount < quantity) {
					throw new BadRequestException('Amount < quantity')
				}

				const cart = manager.create(Cart, {
					productId,
					quantity,
					userId,
				})

				await manager.save(cart)
			})
		} catch (error) {
			throw error
		}
	}

	async changeQuantity(
		userId: number,
		changeQuantity: ChangeQuantityDto
	): Promise<void> {
		const { productId, quantity } = changeQuantity

		try {
			await this.cartRepo.manager.transaction(
				'READ COMMITTED',
				async (manager) => {
					const product = await manager.findOne(Product, productId, {
						lock: { mode: 'pessimistic_write' },
					})

					if (!product) throw new BadRequestException('Invalid product id')

					// update quantity and check if quantity after update > 0 and < amount
					const result = await manager.query(changeQuantityQuery, [
						quantity,
						userId,
						productId,
					])

					const affected = result[1]

					if (affected === 0)
						throw new BadRequestException('Invalid quantity')
				}
			)
		} catch (error) {
			throw error
		}
	}

	removeProduct(userId: number, productId: number) {
		return this.cartRepo.removeProduct(userId, productId)
	}
}
