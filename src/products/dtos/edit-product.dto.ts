import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class EditProductDto {
	@IsNumber()
	@IsOptional()
	@Min(0)
	id: number

	@IsString()
	@IsOptional()
	name: string

	@IsString()
	@IsOptional()
	description: string

	@IsOptional()
	@IsBoolean()
	available: boolean

	@IsOptional()
	@IsString()
	unit: string

	@IsOptional()
	@IsNumber()
	@Min(0)
	price: number

	@IsOptional()
	@IsBoolean()
	gender: boolean

	@IsOptional()
	@IsNumber()
	@Min(0)
	amount: number
}
