import {
	IsEmail,
	IsNumber,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'

export class AuthCredentialsDto {
	@IsEmail()
	email: string

	@IsString()
	@MaxLength(25)
	@MinLength(4)
	password: string
}
