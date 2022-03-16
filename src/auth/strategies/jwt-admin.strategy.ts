import { ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UserRoleEnum } from '../entities/userRole.entity'
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { cookieExtractor } from './cookieExtractor'
import { DataAfterValidateType } from '../../common/types'
import { UserRepository } from '../user.repository'

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwtAdmin') {
	constructor(
		@InjectRepository(UserRepository) private userRepo: UserRepository
	) {
		super({
			jwtFromRequest: cookieExtractor('jwtAt'),
			secretOrKey: process.env.JWT_AT_SECRET,
		})
	}

	async validate(payload: JwtPayload): Promise<DataAfterValidateType | false> {
		const { userId } = payload

		const user = await this.userRepo.findOne(userId, {
			relations: ['userRoles'],
		})

		if (!user) return false

		const isAdmin = user.userRoles.some(
			(userRole) => userRole.role === UserRoleEnum.ADMIN
		)

		if (!isAdmin) throw new ForbiddenException('User is not admin')

		const data: DataAfterValidateType = { user }

		return data
	}
}
