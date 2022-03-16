import { User } from 'src/auth/entities/user.entity'

export type DataAfterValidateType = {
	user: User
	refreshToken?: string
}
