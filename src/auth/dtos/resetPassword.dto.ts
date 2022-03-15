import { IsString, MaxLength, MinLength } from 'class-validator'

export class ResetPasswordDto {
	@IsString()
	userId: number

	@IsString()
	secretString: string

	@IsString()
	@MaxLength(25)
	@MinLength(4)
	newPassword: string
}
