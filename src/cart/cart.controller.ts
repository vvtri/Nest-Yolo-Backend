import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { GetAuth } from 'src/common/decorators/getAuth.decorator'
import { ClientGuard } from 'src/common/guards'
import { DataAfterValidateType } from 'src/common/types'
import { CartService } from './cart.service'
import { AddCartDto, ChangeQuantityDto } from './dtos'

@Controller('cart')
@UseGuards(ClientGuard)
export class CartController {
	constructor(private cartService: CartService) {}

	@Get()
	async getCart(@GetAuth() auth: DataAfterValidateType) {
		const result = await this.cartService.getCart(auth.user.id)
		return result
	}

	@Post()
	addCart(
		@GetAuth() auth: DataAfterValidateType,
		@Body() addCartDto: AddCartDto
	) {
		return this.cartService.addCart(auth.user.id, addCartDto)
	}

	@Patch()
	changeQuantity(
		@GetAuth() auth: DataAfterValidateType,
		@Body() changeQuantityDto: ChangeQuantityDto
	) {
		return this.cartService.changeQuantity(auth.user.id, changeQuantityDto)
	}

	@Delete('/:productId')
	async removeProduct(
		@GetAuth() auth: DataAfterValidateType,
		@Param('productId', ParseIntPipe) productId: number
	) {
		await this.cartService.removeProduct(auth.user.id, productId)
	}
}
