import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { AuthService } from '../auth.service'
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { User } from '../entities/user.entity'
import { cookieExtractor } from './cookieExtractor'
import { DataAfterValidateType } from 'src/common/types'
import { UserRepository } from '../user.repository'

@Injectable()
export class JwtClientStrategy extends PassportStrategy(Strategy, 'jwtClient') {
	constructor(@InjectRepository(UserRepository) private userRepo: UserRepository) {
		super({
			jwtFromRequest: cookieExtractor('jwtAt'),
			secretOrKey: 'JWT_AT_SECRET',
		})
	}

	async validate(payload: JwtPayload): Promise<DataAfterValidateType | false> {
		const { userId } = payload

		const user = await this.userRepo.findOne(userId)

		if (!user) throw new UnauthorizedException('Invalid token')

		if (user.verified === false)
			throw new UnauthorizedException('Email is not verified')

		const data: DataAfterValidateType = { user }

		return data
	}
}
