import { EntityRepository, Repository } from 'typeorm'
import { Order } from './entities/order.entity'
import { OrderDetail } from './entities/orderDetail.entity'
import { getOrderQuery } from './query'

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
	async getAllOrders(userId: number) {
		const result = await this.query(getOrderQuery, [userId])
		return result
	}

	async getOrderDetails(userId: number, orderId: number) {
		const qb = this.createQueryBuilder()
			.select('orderDetail')
			.from(OrderDetail, 'orderDetail')
			.leftJoin('orderDetail.order', 'order')
			.leftJoinAndSelect('orderDetail.product', 'product')
			.where('order.userId = :userId', { userId })
			.andWhere('order.id = :orderId', { orderId })

		return await qb.getMany()
	}
}
