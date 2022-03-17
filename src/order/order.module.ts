import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderRepository } from './order.repository'
import { OrderDetailRepository } from './order-detail.repository'
import { CartRepository } from 'src/cart/cart.repository'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			OrderRepository,
			OrderDetailRepository,
			CartRepository,
		]),
	],
	providers: [OrderService],
	controllers: [OrderController],
})
export class OrderModule {}
