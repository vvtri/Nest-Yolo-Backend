import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from 'src/auth/entities/user.entity'
import { DataAfterValidateType } from '../types'

export const GetAuth = createParamDecorator(
	(_data: any, context: ExecutionContext): DataAfterValidateType => {
		const req = context.switchToHttp().getRequest()

		if (!req.user) return null

		return {
			user: req.user.user as User,
			refreshToken: req.user.refreshToken ? req.user.refreshToken : '',
		}
	}
)
