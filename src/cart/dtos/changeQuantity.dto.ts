import { IsNumber, Min } from 'class-validator'

export class ChangeQuantityDto {
	@IsNumber()
	@Min(1)
	productId: number

	@IsNumber()
	quantity: number
}
