import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	UseGuards,
} from '@nestjs/common'
import { GetAuth } from 'src/common/decorators/getAuth.decorator'
import { ClientGuard } from 'src/common/guards'
import { DataAfterValidateType } from 'src/common/types'
import { OrderService } from './order.service'

@Controller('order')
@UseGuards(ClientGuard)
export class OrderController {
	constructor(private orderService: OrderService) {}

	@Get()
	getAllOrders(@GetAuth() auth: DataAfterValidateType) {
		return this.orderService.getAllOrders(auth.user.id)
	}

	@Get('/detail/:id')
	getOrderDetails(
		@GetAuth() auth: DataAfterValidateType,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.orderService.getOrderDetails(auth.user.id, id)
	}

	@Post()
	async orderProductInCart(@GetAuth() auth: DataAfterValidateType) {
		const result = await this.orderService.orderProductInCart(auth.user.id)
		return result
	}
}
