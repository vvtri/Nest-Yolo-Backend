import { Exclude, Expose } from 'class-transformer'

export class UserDto {
	@Expose()
	id: number

	@Expose()
	email: string

	@Expose()
	name: string

	@Expose()
	avatar: string

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date

	@Expose()
	phone: number

	@Expose()
	address: string

	@Expose()
	verified: boolean

	// Exclude
	@Exclude()
	accessToken: string

	@Exclude()
	password: string

	@Exclude()
	refreshToken: string
}
