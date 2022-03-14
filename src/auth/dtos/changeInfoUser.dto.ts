import { IsOptional, IsString } from 'class-validator'

export class ChangeInfoUserDto {
	@IsOptional()
	@IsString()
	avatar: string

	@IsOptional()
	@IsString()
	phone: string

	@IsOptional()
	@IsString()
	address: string

	@IsOptional()
	@IsString()
	name: string
}
