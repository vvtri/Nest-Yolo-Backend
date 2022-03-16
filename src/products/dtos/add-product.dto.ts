import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class AddProductDto {
	@IsString()
	name: string

	@IsString()
	description: string

	@IsOptional()
	@IsBoolean()
	available: boolean

	@IsString()
	unit: string

	@IsNumber()
	@Min(0)
	price: number

	@IsBoolean()
	gender: boolean

	@IsNumber()
	@Min(0)
	amount: number
}
