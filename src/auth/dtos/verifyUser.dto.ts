import { Transform } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class VerifyUserDto {
	@IsString()
	secretString: string

	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	userId: number
}
