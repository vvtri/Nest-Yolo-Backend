import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cart } from 'src/cart/cart.entity'
import { Product } from 'src/products/products.entity'
import { getManager } from 'typeorm'
import { Order } from './entities/order.entity'
import { OrderDetail } from './entities/orderDetail.entity'
import { OrderRepository } from './order.repository'
import { reduceProductAmount } from './query'

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(OrderRepository) private orderRepo: OrderRepository
	) {}

	getAllOrders(userId: number) {
		return this.orderRepo.getAllOrders(userId)
	}

	getOrderDetails(userId: number, orderId: number) {
		return this.orderRepo.getOrderDetails(userId, orderId)
	}

	async orderProductInCart(userId: number) {
		try {
			await getManager().transaction(async (manager) => {
				const promises = []

				// Get cart, product and lock cart, product
				const cart = await manager
					.createQueryBuilder(Cart, 'cart')
					.innerJoinAndSelect(
						'cart.product',
						'product',
						'product.id = cart.productId'
					)
					.where('cart.userId = 2')
					.setLock('pessimistic_write')
					.getMany()

				// Check empty cart
				if (cart.length === 0) throw new BadRequestException('Empty cart')

				// Check quantity <= product amount
				// Get products and lock products
				const result = cart.some(
					(cartItem) => cartItem.product.amount >= cartItem.quantity
				)

				if (!result)
					throw new BadRequestException(
						'There is a product in cart which has quantity > product amount'
					)

				// Add order
				const order = manager.getRepository(Order).create({
					userId,
				})
				await manager.getRepository(Order).save(order)

				// Add order detail
				cart.forEach((cartItem) =>
					promises.push(
						manager.getRepository(OrderDetail).insert({
							orderId: order.id,
							productId: cartItem.productId,
							quantity: cartItem.quantity,
						})
					)
				)

				// Delete product in cart
				promises.push(manager.getRepository(Cart).delete({ userId }))

				// Reduce amount product
				promises.push(
					manager
						.getRepository(Product)
						.query(reduceProductAmount, [userId])
				)

				await Promise.all(promises)
			})
		} catch (error) {
			throw error
		}
	}
}
